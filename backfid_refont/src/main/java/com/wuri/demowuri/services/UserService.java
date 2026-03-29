
package com.wuri.demowuri.services;

import java.util.List;

import com.wuri.demowuri.dto.UserDto;
import com.wuri.demowuri.model.User;

public interface UserService {

    User creerUser(User User);

    User modifierUser(UserDto UserDto, Long id);
    User modifierUserPassword(UserDto UserDto, Long id);


    void deleteUser(Long id);

    User showUser(Long id);

    List<UserDto> listeUser();
}
