package com.wuri.demowuri.services;

import com.wuri.demowuri.dto.*;

public interface OAuthService {
    OAuthClientInfoDto getClientInfo(String clientId);
    String approveConsent(OAuthConsentRequest request);
    /** Flow web : valide IU + password + crée le code en une étape */
    String webAuthorize(OAuthWebAuthorizeRequest request);
    OAuthTokenResponse exchangeCode(OAuthTokenRequest request);
    OAuthUserInfoDto getUserInfo(String accessToken);
}
