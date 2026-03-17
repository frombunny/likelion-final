package com.likelion.last.domain.document.web.dto;

import com.likelion.last.domain.vote.entity.enums.Sector;
import java.util.List;

public record CreateAwardsBySectorRes(
        String sector,
        String sectorName,
        int count,
        List<CreateAwardDetailRes> awards
) {
    public record CreateAwardDetailRes(
            String name,
            String imageUrl
    ) {
    }

    public static CreateAwardsBySectorRes of(
            Sector sector,
            List<CreateAwardDetailRes> awards
    ) {
        return new CreateAwardsBySectorRes(
                sector.name(),
                sector.getName(),
                awards.size(),
                awards
        );
    }
}
