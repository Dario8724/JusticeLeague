package pt.app.JusticeLeague.dto.response;

import lombok.*;
import org.springframework.data.domain.Page;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <T> PageResponse<T> from(Page<T> page) {
        PageResponse<T> r = new PageResponse<>();
        r.setContent(page.getContent());
        r.setPage(page.getNumber());
        r.setSize(page.getSize());
        r.setTotalElements(page.getTotalElements());
        r.setTotalPages(page.getTotalPages());
        r.setLast(page.isLast());
        return r;
    }
}
