/**
 * eIDbf Connect — Plugin "Se connecter avec eIDbf"
 * Version 2.0.0
 *
 * Modes disponibles :
 *   mode: 'redirect' — redirige vers la page de login eIDbf (navigateur standard)
 *   mode: 'qr'       — affiche un QR code à scanner avec l'app eIDbf (recommandé)
 *   mode: 'popup'    — modal in-page avec saisie IU + mot de passe
 *
 * Usage (mode QR recommandé) :
 *   <script src="http://localhost:8081/sdk/eidbf-connect.js"></script>
 *   <div id="btn-eidbf"></div>
 *   <script>
 *     EIDbf.renderButton('#btn-eidbf', {
 *       clientId:     'ma-plateforme',
 *       clientSecret: 'secret123',
 *       redirectUri:  'http://localhost:4200/callback',
 *       scopes:       ['openid', 'profile', 'phone'],
 *       mode:         'qr',
 *       onSuccess: function(user, token) { console.log(user); },
 *       onError:   function(err)         { console.error(err); }
 *     });
 *   </script>
 */
(function (global) {
  'use strict';

  /* ─── Styles ──────────────────────────────────────────────────────────── */
  var CSS = [
    /* Bouton */
    '.eidbf-btn{display:inline-flex;align-items:center;gap:10px;padding:11px 20px;border:none;border-radius:10px;cursor:pointer;background:linear-gradient(135deg,#1A237E,#3949AB);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:15px;font-weight:600;box-shadow:0 2px 8px rgba(26,35,126,.35);transition:opacity .2s;white-space:nowrap;}',
    '.eidbf-btn:hover{opacity:.9;}',
    '.eidbf-btn:active{opacity:.8;}',
    '.eidbf-btn:disabled{opacity:.6;cursor:not-allowed;}',
    '.eidbf-btn__logo{width:22px;height:22px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;color:#1A237E;flex-shrink:0;}',
    '.eidbf-btn--outline{background:#fff;color:#1A237E;border:2px solid #1A237E;box-shadow:none;}',
    '.eidbf-btn--outline:hover{background:#F0F2FF;}',
    '.eidbf-btn--outline .eidbf-btn__logo{background:#1A237E;color:#fff;}',
    /* Overlay */
    '.eidbf-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px;}',
    /* Modal commune */
    '.eidbf-modal{background:#fff;border-radius:20px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '.eidbf-modal__header{background:linear-gradient(180deg,#1A237E,#283593);padding:24px;text-align:center;color:#fff;}',
    '.eidbf-modal__logos{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:12px;}',
    '.eidbf-modal__logo{width:48px;height:48px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.15);overflow:hidden;}',
    '.eidbf-modal__logo img{width:100%;height:100%;object-fit:cover;}',
    '.eidbf-modal__logo-text{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1A237E,#3949AB);display:flex;align-items:center;justify-content:center;color:#fff;font-size:17px;font-weight:700;}',
    '.eidbf-modal__arrow{color:rgba(255,255,255,.7);font-size:18px;}',
    '.eidbf-modal__title{font-size:16px;font-weight:700;margin-bottom:3px;}',
    '.eidbf-modal__sub{font-size:12px;color:rgba(255,255,255,.75);}',
    /* QR section */
    '.eidbf-qr-wrap{padding:20px 24px;text-align:center;}',
    '.eidbf-qr-img{width:220px;height:220px;border-radius:12px;border:3px solid #E8EBF5;display:block;margin:0 auto 14px;}',
    '.eidbf-qr-hint{font-size:12px;color:#6B7280;margin-bottom:4px;}',
    '.eidbf-qr-timer{font-size:11px;color:#9CA3AF;}',
    '.eidbf-qr-timer span{font-weight:700;color:#1A237E;}',
    '.eidbf-qr-status{display:flex;align-items:center;justify-content:center;gap:8px;margin:10px 0;font-size:13px;font-weight:500;}',
    '.eidbf-qr-dot{width:8px;height:8px;border-radius:50%;background:#9CA3AF;animation:eidbf-pulse 1.5s infinite;}',
    '.eidbf-qr-dot--ok{background:#10B981;animation:none;}',
    '.eidbf-qr-dot--err{background:#EF4444;animation:none;}',
    '@keyframes eidbf-pulse{0%,100%{opacity:1}50%{opacity:.3}}',
    /* Scopes */
    '.eidbf-scopes{padding:0 24px 16px;}',
    '.eidbf-scopes__title{font-size:13px;font-weight:700;color:#1A1A2E;margin-bottom:8px;}',
    '.eidbf-scope-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #F0F2F8;}',
    '.eidbf-scope-item:last-child{border-bottom:none;}',
    '.eidbf-scope-icon{width:32px;height:32px;border-radius:50%;background:#E8EBF5;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;margin-top:1px;}',
    '.eidbf-scope-label{font-size:13px;font-weight:600;color:#1A1A2E;}',
    '.eidbf-scope-desc{font-size:11px;color:#6B7280;margin-top:1px;}',
    '.eidbf-badge{background:#E8EBF5;color:#1A237E;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;}',
    /* Toggle Wallet / USSD */
    '.eidbf-toggle{display:flex;gap:4px;background:#F0F2F8;border-radius:10px;padding:4px;margin:0 24px 16px;}',
    '.eidbf-toggle__btn{flex:1;padding:9px;text-align:center;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#6B7280;border:none;background:transparent;transition:.2s;}',
    '.eidbf-toggle__btn.active{background:#fff;color:#1A237E;box-shadow:0 1px 4px rgba(0,0,0,.1);}',
    /* Panel USSD */
    '.eidbf-ussd{padding:0 24px 16px;display:none;}',
    '.eidbf-ussd.visible{display:block;}',
    '.eidbf-ussd__field{margin-bottom:12px;}',
    '.eidbf-ussd__label{display:block;font-size:12px;color:#6B7280;font-weight:500;margin-bottom:6px;}',
    '.eidbf-ussd__input{width:100%;padding:11px 14px;border:none;border-radius:10px;background:#F0F2F8;font-size:15px;outline:none;box-sizing:border-box;transition:.2s;}',
    '.eidbf-ussd__input:focus{background:#E8EBF5;box-shadow:0 0 0 2px rgba(26,35,126,.25);}',
    '.eidbf-ussd__btn{width:100%;padding:13px;border:none;border-radius:10px;cursor:pointer;background:linear-gradient(135deg,#1A237E,#3949AB);color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;}',
    '.eidbf-ussd__btn:disabled{opacity:.6;cursor:not-allowed;}',
    '.eidbf-ussd__err{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:9px 12px;color:#EF4444;font-size:12px;margin-bottom:10px;display:none;}',
    /* Notice */
    '.eidbf-notice{display:flex;gap:8px;background:#EFF6FF;border-radius:10px;padding:10px 12px;font-size:11px;color:#3B82F6;line-height:1.5;margin:0 24px 16px;}',
    /* Footer boutons */
    '.eidbf-modal__footer{padding:0 24px 20px;border-top:1px solid #F0F2F8;padding-top:16px;}',
    '.eidbf-modal__btn-close{width:100%;padding:11px;border:2px solid #E5E7EB;border-radius:10px;cursor:pointer;background:transparent;color:#6B7280;font-size:14px;font-weight:600;}',
    '.eidbf-modal__btn-close:hover{background:#F9FAFB;}',
    /* Spinner */
    '.eidbf-spinner{width:16px;height:16px;border:2px solid rgba(26,35,126,.2);border-top:2px solid #1A237E;border-radius:50%;animation:eidbf-spin .8s linear infinite;display:inline-block;}',
    '@keyframes eidbf-spin{to{transform:rotate(360deg)}}',
    /* Champs popup */
    '.eidbf-field{margin-bottom:14px;padding:0 24px;}',
    '.eidbf-field label{display:block;font-size:12px;color:#6B7280;margin-bottom:6px;font-weight:500;}',
    '.eidbf-field input{width:100%;padding:11px 14px;border:none;border-radius:10px;background:#F0F2F8;font-size:15px;outline:none;transition:.2s;box-sizing:border-box;}',
    '.eidbf-field input:focus{background:#E8EBF5;box-shadow:0 0 0 2px rgba(26,35,126,.25);}',
    '.eidbf-error{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 12px;color:#EF4444;font-size:13px;margin:0 24px 12px;display:none;}',
    '.eidbf-modal__btn-primary{width:100%;padding:14px;border:none;border-radius:10px;cursor:pointer;background:linear-gradient(135deg,#1A237E,#3949AB);color:#fff;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;}',
    '.eidbf-modal__btn-primary:disabled{opacity:.6;cursor:not-allowed;}',
  ].join('');

  /* ─── Icônes scopes ───────────────────────────────────────────────────── */
  var SCOPE_ICONS = {
    'openid':     '&#128737;', // shield
    'profile':    '&#128100;', // person
    'birthdate':  '&#127874;', // cake
    'phone':      '&#128222;', // phone
    'national_id':'&#127371;', // ID card
    'picture':    '&#128247;', // camera
  };

  /* ─── Helpers ─────────────────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('eidbf-css')) return;
    var s = document.createElement('style');
    s.id = 'eidbf-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function randomState() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function qs(sel) {
    return typeof sel === 'string' ? document.querySelector(sel) : sel;
  }

  function formatTimer(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m > 0 ? m + 'min ' : '') + s + 's';
  }

  /* ─── EIDbf ───────────────────────────────────────────────────────────── */
  var EIDbf = {

    _cfg: null,
    _pollTimer: null,
    _countdownTimer: null,
    _overlay: null,

    init: function (config) {
      this._cfg = Object.assign({
        apiUrl:           'http://localhost:8081',
        scopes:           ['openid', 'profile'],
        buttonText:       'Se connecter avec eIDbf',
        theme:            'default',
        mode:             'qr',
        clientName:       null,
        clientLogoUrl:    null,
        onSuccess:        null,
        onError:          null,
        tokenEndpoint:    null,
        userinfoEndpoint: null,
      }, config);

      // Gestion du callback redirect (mode redirect uniquement)
      if (this._cfg.mode === 'redirect') {
        this._handleRedirectCallback();
      }
    },

    renderButton: function (selector, config) {
      injectStyles();
      if (config) this.init(config);

      var container = qs(selector);
      if (!container) { console.warn('[EIDbf] Sélecteur introuvable :', selector); return; }

      var cfg = this._cfg;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'eidbf-btn' + (cfg.theme === 'outline' ? ' eidbf-btn--outline' : '');
      btn.innerHTML = '<div class="eidbf-btn__logo">eID</div><span>' + cfg.buttonText + '</span>';

      var self = this;
      btn.addEventListener('click', function () { self._startFlow(); });
      container.appendChild(btn);
    },

    /* ── Démarrage du flow ──────────────────────────────────────────────── */

    _startFlow: function () {
      var cfg = this._cfg;
      if (cfg.mode === 'qr') {
        this._openQrModal();
      } else if (cfg.mode === 'popup') {
        this._openPopupModal();
      } else {
        this._startRedirectFlow();
      }
    },

    /* ══════════════════════════════════════════════════════════════════════
       MODE QR — Scanner avec l'app eIDbf
    ══════════════════════════════════════════════════════════════════════ */

    _openQrModal: function () {
      var cfg = this._cfg;
      var self = this;

      // 1. Créer la session QR côté backend
      fetch(cfg.apiUrl + '/api/v1/oauth/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:    cfg.clientId,
          client_secret: cfg.clientSecret,
          redirect_uri: cfg.redirectUri,
          scope:        cfg.scopes.join(' '),
          state:        randomState(),
        }),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.session_id) {
          self._onError(data.error || 'Impossible de créer la session QR');
          return;
        }
        self._showQrModal(data);
      })
      .catch(function (e) { self._onError(e.message); });
    },

    _showQrModal: function (sessionData) {
      injectStyles();
      var cfg = this._cfg;
      var self = this;
      var sessionId = sessionData.session_id;
      var expiresIn = sessionData.expires_in || 300;
      var clientInfo = sessionData.client_info || {};
      var scopes = sessionData.scopes || [];
      var clientName = clientInfo.name || cfg.clientName || 'Plateforme externe';
      var clientInitial = clientName.charAt(0).toUpperCase();

      // Image QR via endpoint backend
      var qrImgUrl = cfg.apiUrl + '/api/v1/oauth/qr/' + sessionId + '/image';

      // Logo client
      var clientLogoHtml = cfg.clientLogoUrl
        ? '<div class="eidbf-modal__logo"><img src="' + cfg.clientLogoUrl + '" alt=""></div>'
        : '<div class="eidbf-modal__logo-text">' + clientInitial + '</div>';

      // Scopes à afficher (informatif — le citoyen sélectionne dans l'app)
      var scopesHtml = scopes.length ? [
        '<div class="eidbf-scopes">',
          '<div class="eidbf-scopes__title">Informations qui seront partagées</div>',
          scopes.map(function (s) {
            var icon = SCOPE_ICONS[s.scope] || '&#128274;';
            var req  = s.required ? '<span class="eidbf-badge">requis</span>' : '';
            return [
              '<div class="eidbf-scope-item">',
                '<div class="eidbf-scope-icon">' + icon + '</div>',
                '<div>',
                  '<div class="eidbf-scope-label">' + s.label + req + '</div>',
                  '<div class="eidbf-scope-desc">' + s.description + '</div>',
                '</div>',
              '</div>',
            ].join('');
          }).join(''),
        '</div>',
      ].join('') : '';

      var overlay = document.createElement('div');
      overlay.className = 'eidbf-overlay';
      overlay.id = 'eidbf-overlay-' + sessionId;

      overlay.innerHTML = [
        '<div class="eidbf-modal">',
          '<div class="eidbf-modal__header">',
            '<div class="eidbf-modal__logos">',
              '<div class="eidbf-modal__logo"><div style="width:100%;height:100%;background:#1A237E;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:10px">eID</div></div>',
              '<span class="eidbf-modal__arrow">&#8644;</span>',
              clientLogoHtml,
            '</div>',
            '<div class="eidbf-modal__title">' + clientName + '</div>',
            '<div class="eidbf-modal__sub">Connectez-vous avec votre identité eIDbf</div>',
          '</div>',

          // Toggle Wallet / USSD
          '<div class="eidbf-toggle">',
            '<button type="button" class="eidbf-toggle__btn active" id="_eidbf_tab_wallet_' + sessionId + '">&#128247; Wallet</button>',
            '<button type="button" class="eidbf-toggle__btn" id="_eidbf_tab_ussd_' + sessionId + '">&#128225; USSD</button>',
          '</div>',

          // Panel Wallet (QR)
          '<div id="_eidbf_panel_wallet_' + sessionId + '">',
            '<div class="eidbf-qr-wrap">',
              '<img class="eidbf-qr-img" src="' + qrImgUrl + '" alt="QR Code eIDbf" id="_eidbf_qr_img_' + sessionId + '">',
              '<div class="eidbf-qr-hint">Ouvrez <strong>eIDbf</strong> &rarr; eServices &rarr; <strong>Authentification</strong></div>',
              '<div class="eidbf-qr-status" id="_eidbf_qr_status_' + sessionId + '">',
                '<div class="eidbf-qr-dot" id="_eidbf_qr_dot_' + sessionId + '"></div>',
                '<span id="_eidbf_qr_msg_' + sessionId + '">En attente du scan...</span>',
              '</div>',
              '<div class="eidbf-qr-timer">Expire dans <span id="_eidbf_qr_timer_' + sessionId + '">' + formatTimer(expiresIn) + '</span></div>',
            '</div>',
            scopesHtml,
            '<div class="eidbf-notice"><span>&#128737;</span><span>Scannez le QR avec l\'app eIDbf et confirmez avec votre biométrie.</span></div>',
          '</div>',

          // Panel USSD (formulaire)
          '<div class="eidbf-ussd" id="_eidbf_panel_ussd_' + sessionId + '">',
            '<div class="eidbf-ussd__err" id="_eidbf_ussd_err_' + sessionId + '"></div>',
            '<div class="eidbf-ussd__field">',
              '<label class="eidbf-ussd__label">Identifiant Unique (IU)</label>',
              '<input class="eidbf-ussd__input" type="number" id="_eidbf_ussd_iu_' + sessionId + '" placeholder="Ex : 647102974943">',
            '</div>',
            '<div class="eidbf-ussd__field">',
              '<label class="eidbf-ussd__label">Code OTP reçu par USSD</label>',
              '<input class="eidbf-ussd__input" type="number" id="_eidbf_ussd_otp_' + sessionId + '" placeholder="Ex : 123456">',
            '</div>',
            '<button type="button" class="eidbf-ussd__btn" id="_eidbf_ussd_btn_' + sessionId + '">&#128274; S\'authentifier</button>',
            '<div class="eidbf-notice" style="margin:12px 0 0;">',
              '<span>&#128225;</span>',
              '<span>Composez <strong>*123#</strong> pour recevoir votre code OTP par USSD.</span>',
            '</div>',
          '</div>',

          '<div class="eidbf-modal__footer">',
            '<button type="button" class="eidbf-modal__btn-close" id="_eidbf_qr_close_' + sessionId + '">Annuler</button>',
          '</div>',
        '</div>',
      ].join('');

      document.body.appendChild(overlay);
      this._overlay = overlay;

      // Fermeture
      document.getElementById('_eidbf_qr_close_' + sessionId).addEventListener('click', function () {
        self._closeQrModal(sessionId);
      });

      // Countdown timer
      var remaining = expiresIn;
      this._countdownTimer = setInterval(function () {
        remaining--;
        var timerEl = document.getElementById('_eidbf_qr_timer_' + sessionId);
        if (timerEl) timerEl.textContent = formatTimer(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(self._countdownTimer);
          self._updateQrStatus(sessionId, 'EXPIRED', 'Session expirée');
        }
      }, 1000);

      // Polling status
      this._startPolling(sessionId);
    },

    _startPolling: function (sessionId) {
      var cfg = this._cfg;
      var self = this;
      var attempts = 0;
      var maxAttempts = 150; // 5 min à 2s d'intervalle

      this._pollTimer = setInterval(function () {
        attempts++;
        if (attempts > maxAttempts) {
          clearInterval(self._pollTimer);
          self._updateQrStatus(sessionId, 'EXPIRED', 'Session expirée');
          return;
        }

        fetch(cfg.apiUrl + '/api/v1/oauth/qr/' + sessionId + '/status')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var status = data.status;

          if (status === 'APPROVED' && data.redirect_url) {
            clearInterval(self._pollTimer);
            clearInterval(self._countdownTimer);
            self._updateQrStatus(sessionId, 'APPROVED', 'Scan confirmé !');

            setTimeout(function () {
              self._closeQrModal(sessionId);
              // Extraire le code depuis redirect_url
              var url = new URL(data.redirect_url);
              var code = url.searchParams.get('code');
              if (code) {
                self._exchangeCode(code);
              } else {
                self._onError('code_missing');
              }
            }, 800);

          } else if (status === 'DENIED') {
            clearInterval(self._pollTimer);
            clearInterval(self._countdownTimer);
            self._updateQrStatus(sessionId, 'DENIED', 'Connexion refusée');
            setTimeout(function () { self._closeQrModal(sessionId); }, 1500);

          } else if (status === 'EXPIRED') {
            clearInterval(self._pollTimer);
            clearInterval(self._countdownTimer);
            self._updateQrStatus(sessionId, 'EXPIRED', 'Session expirée');
          }
        })
        .catch(function () { /* ignorer les erreurs réseau passagères */ });

      }, 2000);
    },

    _updateQrStatus: function (sessionId, status, msg) {
      var dot = document.getElementById('_eidbf_qr_dot_' + sessionId);
      var msgEl = document.getElementById('_eidbf_qr_msg_' + sessionId);
      if (!dot || !msgEl) return;

      dot.className = 'eidbf-qr-dot';
      if (status === 'APPROVED') dot.classList.add('eidbf-qr-dot--ok');
      else if (status === 'DENIED' || status === 'EXPIRED') dot.classList.add('eidbf-qr-dot--err');

      msgEl.textContent = msg;
    },

    _closeQrModal: function (sessionId) {
      clearInterval(this._pollTimer);
      clearInterval(this._countdownTimer);
      var overlay = document.getElementById('eidbf-overlay-' + sessionId);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      this._overlay = null;
    },

    /* ══════════════════════════════════════════════════════════════════════
       MODE REDIRECT — Standard OAuth
    ══════════════════════════════════════════════════════════════════════ */

    _startRedirectFlow: function () {
      var cfg = this._cfg;
      var state = randomState();
      sessionStorage.setItem('eidbf_state', state);
      sessionStorage.setItem('eidbf_cfg', JSON.stringify({
        clientId: cfg.clientId, clientSecret: cfg.clientSecret,
        redirectUri: cfg.redirectUri, apiUrl: cfg.apiUrl,
      }));

      var params = new URLSearchParams({
        client_id: cfg.clientId, redirect_uri: cfg.redirectUri,
        scope: cfg.scopes.join(' '), state: state, response_type: 'code',
      });
      window.location.href = cfg.apiUrl + '/api/v1/oauth/authorize?' + params.toString();
    },

    _handleRedirectCallback: function () {
      var urlParams = new URLSearchParams(window.location.search);
      var code = urlParams.get('code');
      var error = urlParams.get('error');

      if (error) { this._onError(error); return; }
      if (!code) return;

      // Nettoyer l'URL
      try {
        var clean = new URL(window.location.href);
        clean.searchParams.delete('code');
        clean.searchParams.delete('state');
        window.history.replaceState({}, '', clean.toString());
      } catch (e) {}

      // Récupérer config depuis sessionStorage
      try {
        var saved = JSON.parse(sessionStorage.getItem('eidbf_cfg') || '{}');
        sessionStorage.removeItem('eidbf_cfg');
        sessionStorage.removeItem('eidbf_state');
        if (saved.clientId) {
          this._cfg = this._cfg || {};
          this._cfg.clientId     = this._cfg.clientId     || saved.clientId;
          this._cfg.clientSecret = this._cfg.clientSecret || saved.clientSecret;
          this._cfg.redirectUri  = this._cfg.redirectUri  || saved.redirectUri;
          this._cfg.apiUrl       = this._cfg.apiUrl       || saved.apiUrl;
        }
      } catch (e) {}

      this._exchangeCode(code);
    },

    /* ══════════════════════════════════════════════════════════════════════
       MODE POPUP — Modal IU + mot de passe
    ══════════════════════════════════════════════════════════════════════ */

    _openPopupModal: function () {
      injectStyles();
      var cfg = this._cfg;
      var self = this;
      var clientName = cfg.clientName || 'Cette application';
      var clientInitial = clientName.charAt(0).toUpperCase();
      var clientLogoHtml = cfg.clientLogoUrl
        ? '<div class="eidbf-modal__logo"><img src="' + cfg.clientLogoUrl + '" alt=""></div>'
        : '<div class="eidbf-modal__logo-text">' + clientInitial + '</div>';

      var overlay = document.createElement('div');
      overlay.className = 'eidbf-overlay';
      overlay.innerHTML = [
        '<div class="eidbf-modal">',
          '<div class="eidbf-modal__header">',
            '<div class="eidbf-modal__logos">',
              '<div class="eidbf-modal__logo"><div style="width:100%;height:100%;background:#1A237E;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:10px">eID</div></div>',
              '<span class="eidbf-modal__arrow">&#8644;</span>',
              clientLogoHtml,
            '</div>',
            '<div class="eidbf-modal__title">' + clientName + '</div>',
            '<div class="eidbf-modal__sub">demande l\'acc&egrave;s &agrave; votre identit&eacute; eIDbf</div>',
          '</div>',
          '<div id="_eidbf_err" class="eidbf-error"></div>',
          '<div class="eidbf-field"><label>Identifiant Unique (IU)</label><input type="number" id="_eidbf_iu" placeholder="Ex: 647102974943"></div>',
          '<div class="eidbf-field"><label>Mot de passe</label><input type="password" id="_eidbf_pw" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"></div>',
          '<div class="eidbf-notice"><span>&#128737;</span><span>eIDbf ne partagera jamais votre mot de passe.</span></div>',
          '<div class="eidbf-modal__footer">',
            '<button type="button" class="eidbf-modal__btn-primary" id="_eidbf_ok">&#128274; Autoriser</button>',
            '<button type="button" class="eidbf-modal__btn-close" id="_eidbf_cancel">Annuler</button>',
          '</div>',
        '</div>',
      ].join('');

      document.body.appendChild(overlay);

      document.getElementById('_eidbf_ok').addEventListener('click', function () { self._submitPopup(overlay); });
      document.getElementById('_eidbf_pw').addEventListener('keydown', function (e) { if (e.key === 'Enter') self._submitPopup(overlay); });
      document.getElementById('_eidbf_cancel').addEventListener('click', function () { document.body.removeChild(overlay); });
    },

    _submitPopup: function (overlay) {
      var cfg = this._cfg;
      var iu  = document.getElementById('_eidbf_iu').value.trim();
      var pw  = document.getElementById('_eidbf_pw').value;
      var err = document.getElementById('_eidbf_err');
      var btn = document.getElementById('_eidbf_ok');

      if (!iu || !pw) {
        err.style.display = 'block';
        err.textContent = 'Veuillez renseigner votre IU et mot de passe.';
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<div class="eidbf-spinner"></div>';
      err.style.display = 'none';

      var self = this;
      fetch(cfg.apiUrl + '/api/v1/oauth/web/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iu: iu, password: pw,
          client_id: cfg.clientId, redirect_uri: cfg.redirectUri,
          scope: cfg.scopes.join(' '), state: randomState(),
          approved_scopes: cfg.scopes, code_challenge: null, code_challenge_method: null,
        }),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.code) {
          document.body.removeChild(overlay);
          self._exchangeCode(data.code);
        } else {
          err.style.display = 'block';
          err.textContent = data.error || 'Identifiants incorrects.';
          btn.disabled = false;
          btn.innerHTML = '&#128274; Autoriser';
        }
      })
      .catch(function () {
        err.style.display = 'block';
        err.textContent = 'Erreur de connexion.';
        btn.disabled = false;
        btn.innerHTML = '&#128274; Autoriser';
      });
    },

    /* ── Échange code → token → userinfo ────────────────────────────────── */

    _exchangeCode: function (code) {
      var cfg = this._cfg;
      var self = this;
      var url = cfg.tokenEndpoint || (cfg.apiUrl + '/api/v1/oauth/token');

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code', code: code,
          redirect_uri: cfg.redirectUri,
          client_id: cfg.clientId, client_secret: cfg.clientSecret,
        }),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.access_token) {
          self._getUserInfo(data.access_token, data);
        } else {
          self._onError(data.error || 'token_error');
        }
      })
      .catch(function (e) { self._onError(e.message); });
    },

    _getUserInfo: function (accessToken, tokenData) {
      var cfg = this._cfg;
      var self = this;
      var url = cfg.userinfoEndpoint || (cfg.apiUrl + '/api/v1/oauth/userinfo');

      fetch(url, { headers: { 'Authorization': 'Bearer ' + accessToken } })
      .then(function (r) { return r.json(); })
      .then(function (user) {
        if (cfg.onSuccess) cfg.onSuccess(user, accessToken, tokenData);
      })
      .catch(function (e) { self._onError(e.message); });
    },

    _onError: function (err) {
      if (this._cfg && this._cfg.onError) this._cfg.onError(err);
      else console.error('[EIDbf] Erreur :', err);
    },

    logout: function () {
      sessionStorage.removeItem('eidbf_state');
      sessionStorage.removeItem('eidbf_cfg');
    },
  };

  global.EIDbf = EIDbf;

})(window);
