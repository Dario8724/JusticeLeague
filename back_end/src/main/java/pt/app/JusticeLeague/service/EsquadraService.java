package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.response.EsquadraDTO;
import pt.app.JusticeLeague.model.Esquadra;
import pt.app.JusticeLeague.repository.EsquadraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EsquadraService {

    @Autowired
    private EsquadraRepository esquadraRepository;

    public List<EsquadraDTO> listarTodas() {
        return esquadraRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EsquadraDTO> listarProximas(double lat, double lon, double raio) {
        return esquadraRepository.findProximas(lat, lon, raio)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EsquadraDTO> listarCiber() {
        return esquadraRepository.findByEspecializadaCiberTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private EsquadraDTO toDTO(Esquadra e) {
        return EsquadraDTO.builder()
                .id(e.getId())
                .nome(e.getNome())
                .distrito(e.getDistrito())
                .concelho(e.getConcelho())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .contacto(e.getContacto())
                .especializadaCiber(e.getEspecializadaCiber())
                .build();
    }
}
