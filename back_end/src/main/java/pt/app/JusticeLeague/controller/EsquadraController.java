package pt.app.JusticeLeague.controller;

import pt.app.JusticeLeague.dto.response.EsquadraDTO;
import pt.app.JusticeLeague.service.EsquadraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/esquadras")
public class EsquadraController {

    @Autowired
    private EsquadraService esquadraService;

    @GetMapping
    public ResponseEntity<List<EsquadraDTO>> listarTodas() {
        return ResponseEntity.ok(esquadraService.listarTodas());
    }

    @GetMapping("/proximas")
    public ResponseEntity<List<EsquadraDTO>> listarProximas(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "0.5") double raio) {
        return ResponseEntity.ok(esquadraService.listarProximas(lat, lon, raio));
    }

    @GetMapping("/ciber")
    public ResponseEntity<List<EsquadraDTO>> listarCiber() {
        return ResponseEntity.ok(esquadraService.listarCiber());
    }
}
