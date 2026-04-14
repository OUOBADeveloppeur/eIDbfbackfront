package com.wuri.demowuri.controller;

import com.wuri.demowuri.dto.*;
import com.wuri.demowuri.services.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;

    // ── Mobile : infos client pour l'ecran de consentement ──────────────────
    @GetMapping("/clients/{clientId}")
    public ResponseEntity<OAuthClientInfoDto> getClientInfo(@PathVariable String clientId) {
        try {
            return ResponseEntity.ok(oauthService.getClientInfo(clientId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ── Mobile : approbation du consentement (JWT citoyen requis) ────────────
    @PostMapping("/consent")
    public ResponseEntity<Map<String, String>> approveConsent(
            @RequestBody OAuthConsentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String code = oauthService.approveConsent(request);
            return ResponseEntity.ok(Map.of(
                    "code", code,
                    "state", request.getState() != null ? request.getState() : ""));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Web : page HTML de login (navigateur redirige ici) ──────────────────
    @GetMapping(value = "/authorize", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> authorizeWeb(
            @RequestParam("client_id") String clientId,
            @RequestParam("redirect_uri") String redirectUri,
            @RequestParam(value = "scope", defaultValue = "openid profile") String scope,
            @RequestParam(value = "state", defaultValue = "") String state,
            @RequestParam(value = "response_type", defaultValue = "code") String responseType,
            @RequestParam(value = "code_challenge", required = false) String codeChallenge,
            @RequestParam(value = "code_challenge_method", required = false) String codeChallengeMethod) {

        OAuthClientInfoDto client;
        try {
            client = oauthService.getClientInfo(clientId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_HTML)
                    .body(errorPage("Client OAuth introuvable : " + clientId));
        }

        String html = buildAuthorizePage(client, clientId, redirectUri, scope, state,
                codeChallenge, codeChallengeMethod);
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
    }

    // ── Web : validation credentials + code en une etape ────────────────────
    @PostMapping("/web/authorize")
    public ResponseEntity<?> webAuthorize(@RequestBody OAuthWebAuthorizeRequest request) {
        try {
            String code = oauthService.webAuthorize(request);
            String sep = request.getRedirectUri().contains("?") ? "&" : "?";
            String callbackUrl = request.getRedirectUri() + sep + "code=" + code
                    + (request.getState() != null && !request.getState().isEmpty()
                            ? "&state=" + request.getState() : "");
            return ResponseEntity.ok(Map.of(
                    "code", code,
                    "state", request.getState() != null ? request.getState() : "",
                    "redirect_url", callbackUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Backend-to-backend : echange code -> access token ───────────────────
    @PostMapping("/token")
    public ResponseEntity<?> exchangeToken(@RequestBody OAuthTokenRequest request) {
        try {
            return ResponseEntity.ok(oauthService.exchangeCode(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_grant", "error_description", e.getMessage()));
        }
    }

    // ── Backend-to-backend : profil citoyen (token OAuth) ───────────────────
    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token manquant"));
        }
        try {
            return ResponseEntity.ok(oauthService.getUserInfo(authHeader.substring(7)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_token", "error_description", e.getMessage()));
        }
    }

    // ── OIDC Discovery ───────────────────────────────────────────────────────
    @GetMapping("/.well-known/openid-configuration")
    public ResponseEntity<Map<String, Object>> openidConfiguration(
            @RequestHeader(value = "Host", defaultValue = "192.168.1.194:8081") String host) {
        String base = "http://" + host + "/api/v1/oauth";
        return ResponseEntity.ok(Map.of(
                "issuer", base,
                "authorization_endpoint", base + "/authorize",
                "token_endpoint", base + "/token",
                "userinfo_endpoint", base + "/userinfo",
                "scopes_supported", new String[]{"openid", "profile", "phone", "birthdate", "national_id", "picture"},
                "response_types_supported", new String[]{"code"},
                "grant_types_supported", new String[]{"authorization_code"},
                "code_challenge_methods_supported", new String[]{"S256", "plain"}
        ));
    }

    // ════════════════════════════════════════════════════════════════════════
    // Generation de la page HTML de consentement web
    // ════════════════════════════════════════════════════════════════════════

    private String buildAuthorizePage(OAuthClientInfoDto client, String clientId,
            String redirectUri, String scope, String state,
            String codeChallenge, String codeChallengeMethod) {

        String[] scopes = scope.split(" ");
        StringBuilder scopeRows = new StringBuilder();
        for (String s : scopes) {
            boolean required = "openid".equals(s);
            String trailing = required
                    ? "<span class='badge'>requis</span>"
                    : "<input type='checkbox' class='scope-cb' value='" + s + "' checked>";
            scopeRows.append("<div class='scope-row'>")
                     .append("<div class='scope-icon'>").append(scopeIcon(s)).append("</div>")
                     .append("<div class='scope-info'>")
                     .append("<div class='scope-label'>").append(scopeLabel(s)).append("</div>")
                     .append("<div class='scope-desc'>").append(scopeDesc(s)).append("</div>")
                     .append("</div>")
                     .append(trailing)
                     .append("</div>");
        }

        String fallbackLetter = (client.getName() != null && !client.getName().isEmpty())
                ? String.valueOf(client.getName().charAt(0)).toUpperCase() : "G";

        String logoHtml = (client.getLogoUrl() != null)
                ? "<img src='" + client.getLogoUrl() + "' class='client-logo'" +
                  " onerror=\"this.style.display='none';document.getElementById('lf').style.display='flex'\">"
                : "";
        String fallbackDisplay = (client.getLogoUrl() == null) ? "flex" : "none";

        return "<!DOCTYPE html><html lang='fr'><head>"
             + "<meta charset='UTF-8'>"
             + "<meta name='viewport' content='width=device-width,initial-scale=1'>"
             + "<title>Connexion via eIDbf</title>"
             + "<style>"
             + "*{box-sizing:border-box;margin:0;padding:0}"
             + "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"
             +      "background:#F5F7FA;min-height:100vh;display:flex;flex-direction:column}"
             + ".header{background:linear-gradient(180deg,#1A237E,#283593);padding:32px 24px;"
             +         "text-align:center;color:#fff}"
             + ".logos{display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:16px}"
             + ".logo-wrap{width:60px;height:60px;border-radius:50%;background:#fff;overflow:hidden;"
             +            "box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center}"
             + ".logo-wrap img{width:100%;height:100%;object-fit:cover}"
             + ".logo-fb{width:100%;height:100%;background:linear-gradient(135deg,#1A237E,#3949AB);"
             +          "color:#fff;font-size:22px;font-weight:700;display:none;"
             +          "align-items:center;justify-content:center;border-radius:50%}"
             + ".arrow{color:rgba(255,255,255,.7);font-size:22px}"
             + ".header h2{font-size:18px;font-weight:700;margin-bottom:4px}"
             + ".header p{font-size:13px;color:rgba(255,255,255,.75)}"
             + ".card{background:#fff;margin:24px 16px;border-radius:16px;"
             +       "box-shadow:0 2px 12px rgba(0,0,0,.06);overflow:hidden}"
             + ".section{padding:20px}"
             + ".section-title{font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:12px}"
             + ".field{margin-bottom:14px}"
             + ".field label{display:block;font-size:13px;color:#6B7280;margin-bottom:6px}"
             + ".field input{width:100%;padding:12px 16px;border:none;border-radius:10px;"
             +              "background:#F0F2F8;font-size:15px;outline:none;transition:.2s}"
             + ".field input:focus{background:#E8EBF5;box-shadow:0 0 0 2px rgba(26,35,126,.25)}"
             + ".divider{height:1px;background:#E5E7EB;margin:0 20px}"
             + ".scope-row{display:flex;align-items:center;gap:12px;padding:10px 0;"
             +            "border-bottom:1px solid #F0F2F8}"
             + ".scope-row:last-child{border-bottom:none}"
             + ".scope-icon{width:36px;height:36px;border-radius:50%;background:#E8EBF5;"
             +             "display:flex;align-items:center;justify-content:center;"
             +             "font-size:14px;font-weight:700;color:#1A237E;flex-shrink:0}"
             + ".scope-info{flex:1}"
             + ".scope-label{font-size:14px;font-weight:600;color:#1A1A2E}"
             + ".scope-desc{font-size:12px;color:#6B7280;margin-top:2px}"
             + ".badge{background:#E8EBF5;color:#1A237E;font-size:10px;font-weight:600;"
             +        "padding:2px 8px;border-radius:4px}"
             + ".scope-cb{width:18px;height:18px;accent-color:#1A237E;cursor:pointer;flex-shrink:0}"
             + ".notice{display:flex;gap:10px;background:#EFF6FF;border-radius:10px;"
             +         "padding:12px;margin-top:16px;font-size:12px;color:#3B82F6;line-height:1.5}"
             + ".btn-primary{width:100%;padding:15px;border:none;border-radius:10px;cursor:pointer;"
             +              "background:linear-gradient(135deg,#1A237E,#3949AB);color:#fff;"
             +              "font-size:16px;font-weight:600;display:flex;align-items:center;"
             +              "justify-content:center;gap:8px;transition:.2s}"
             + ".btn-primary:disabled{opacity:.6;cursor:not-allowed}"
             + ".btn-secondary{width:100%;padding:14px;border:2px solid #1A237E;border-radius:10px;"
             +                "cursor:pointer;background:transparent;color:#1A237E;"
             +                "font-size:15px;font-weight:600;margin-top:10px}"
             + ".actions{padding:16px 20px 24px}"
             + ".error-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;"
             +            "padding:12px;color:#EF4444;font-size:14px;margin-bottom:14px;display:none}"
             + ".spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.4);"
             +          "border-top:2px solid #fff;border-radius:50%;animation:spin .8s linear infinite}"
             + "@keyframes spin{to{transform:rotate(360deg)}}"
             + "</style></head><body>"

             + "<div class='header'>"
             + "<div class='logos'>"
             + "<div class='logo-wrap'>"
             + "<div style='width:100%;height:100%;background:#1A237E;display:flex;align-items:center;"
             +            "justify-content:center;color:white;font-weight:900;font-size:13px'>eID</div>"
             + "</div>"
             + "<div class='arrow'>&#8644;</div>"
             + "<div class='logo-wrap'>"
             + logoHtml
             + "<div class='logo-fb' id='lf' style='display:" + fallbackDisplay + "'>" + fallbackLetter + "</div>"
             + "</div></div>"
             + "<h2>" + escapeHtml(client.getName()) + "</h2>"
             + "<p>demande l'acc&egrave;s &agrave; votre identit&eacute; eIDbf</p>"
             + "</div>"

             + "<div class='card'><div class='section'>"
             + "<div class='section-title'>Identifiez-vous</div>"
             + "<div id='err' class='error-box'></div>"
             + "<div class='field'><label>Identifiant Unique (IU)</label>"
             + "<input type='number' id='iu' placeholder='Ex: 123456789012' maxlength='12'></div>"
             + "<div class='field'><label>Mot de passe</label>"
             + "<input type='password' id='pw' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'></div>"
             + "</div>"
             + "<div class='divider'></div>"
             + "<div class='section'>"
             + "<div class='section-title'>Informations partag&eacute;es</div>"
             + scopeRows
             + "<div class='notice'><span>&#128737;</span>"
             + "<span>eIDbf ne partagera jamais votre mot de passe. "
             + "Vous pouvez r&eacute;voquer cet acc&egrave;s &agrave; tout moment.</span>"
             + "</div></div></div>"

             + "<div class='actions'>"
             + "<button class='btn-primary' id='btn' onclick='doAuth()'>"
             + "&#128274; Autoriser"
             + "</button>"
             + "<button class='btn-secondary' onclick='doDeny()'>Refuser</button>"
             + "</div>"

             + "<script>"
             + "var CID='" + escapeJs(clientId) + "';"
             + "var RURI='" + escapeJs(redirectUri) + "';"
             + "var STATE='" + escapeJs(state) + "';"
             + "var CC='" + escapeJs(codeChallenge != null ? codeChallenge : "") + "';"
             + "var CCM='" + escapeJs(codeChallengeMethod != null ? codeChallengeMethod : "") + "';"
             + "var API=window.location.origin;"
             + "function scopes(){"
             +   "var cbs=document.querySelectorAll('.scope-cb:checked'),s=['openid'];"
             +   "cbs.forEach(function(c){if(s.indexOf(c.value)<0)s.push(c.value);});"
             +   "return s;"
             + "}"
             + "function doAuth(){"
             +   "var iu=document.getElementById('iu').value.trim();"
             +   "var pw=document.getElementById('pw').value;"
             +   "var err=document.getElementById('err');"
             +   "var btn=document.getElementById('btn');"
             +   "if(!iu||!pw){err.style.display='block';"
             +     "err.textContent='Veuillez renseigner votre IU et mot de passe.';return;}"
             +   "btn.disabled=true;"
             +   "btn.innerHTML='<div class=\"spinner\"></div>';"
             +   "err.style.display='none';"
             +   "fetch(API+'/api/v1/oauth/web/authorize',{"
             +     "method:'POST',"
             +     "headers:{'Content-Type':'application/json'},"
             +     "body:JSON.stringify({iu:iu,password:pw,client_id:CID,redirect_uri:RURI,"
             +       "scope:scopes().join(' '),state:STATE,approved_scopes:scopes(),"
             +       "code_challenge:CC||null,code_challenge_method:CCM||null})"
             +   "}).then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d};});}).then(function(res){"
             +     "if(res.ok&&res.d.redirect_url){window.location.href=res.d.redirect_url;}"
             +     "else{err.style.display='block';"
             +       "err.textContent=res.d.error||'Identifiants incorrects.';"
             +       "btn.disabled=false;btn.innerHTML='&#128274; Autoriser';}"
             +   "}).catch(function(){"
             +     "err.style.display='block';"
             +     "err.textContent='Erreur de connexion au serveur.';"
             +     "btn.disabled=false;btn.innerHTML='&#128274; Autoriser';"
             +   "});"
             + "}"
             + "function doDeny(){"
             +   "var sep=RURI.indexOf('?')>=0?'&':'?';"
             +   "window.location.href=RURI+sep+'error=access_denied&state='+encodeURIComponent(STATE);"
             + "}"
             + "document.getElementById('pw').addEventListener('keydown',function(e){"
             +   "if(e.key==='Enter')doAuth();"
             + "});"
             + "</script></body></html>";
    }

    private String errorPage(String message) {
        return "<!DOCTYPE html><html><body style='font-family:sans-serif;padding:40px;color:#EF4444'>"
             + "<h2>Erreur OAuth</h2><p>" + escapeHtml(message) + "</p></body></html>";
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;");
    }

    private String escapeJs(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n");
    }

    private String scopeLabel(String scope) {
        switch (scope) {
            case "openid":      return "Authentification securisee";
            case "profile":     return "Nom et prenom";
            case "birthdate":   return "Date et lieu de naissance";
            case "phone":       return "Numero de telephone";
            case "national_id": return "Identifiant unique (IU)";
            case "picture":     return "Photo d'identite";
            default:            return scope;
        }
    }

    private String scopeDesc(String scope) {
        switch (scope) {
            case "openid":      return "Confirme votre identite sans exposer de donnees personnelles";
            case "profile":     return "Votre nom complet tel qu'il figure sur votre CNIB";
            case "birthdate":   return "Votre date et lieu de naissance officiels";
            case "phone":       return "Votre numero de telephone enregistre";
            case "national_id": return "Votre numero d'identifiant national unique";
            case "picture":     return "Votre photo officielle d'identite";
            default:            return "";
        }
    }

    private String scopeIcon(String scope) {
        switch (scope) {
            case "openid":      return "OK";
            case "profile":     return "ID";
            case "birthdate":   return "DN";
            case "phone":       return "TEL";
            case "national_id": return "IU";
            case "picture":     return "IMG";
            default:            return "?";
        }
    }
}
