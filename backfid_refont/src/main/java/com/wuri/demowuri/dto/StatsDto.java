package com.wuri.demowuri.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private long personnesCount;
    private long usersCount;
    private long autoritesCount;
    private long eservicesCount;

}
