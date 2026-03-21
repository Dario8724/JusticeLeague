package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.Esquadra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EsquadraRepository extends JpaRepository<Esquadra, Long> {

    List<Esquadra> findByDistrito(String distrito);
    List<Esquadra> findByEspecializadaCiberTrue();

    // Esquadras próximas por coordenadas (raio aproximado)
    @Query(""" 
        SELECT e FROM Esquadra e 
        WHERE ABS(e.latitude  - :lat) < :raio 
          AND ABS(e.longitude - :lon) < :raio 
    """)
    List<Esquadra> findProximas(
        @Param("lat")  double lat,
        @Param("lon")  double lon,
        @Param("raio") double raio
    );
}
