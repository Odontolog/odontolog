package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.SupervisorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("isAuthenticated()")
@RestController
public class SupervisorController {

    private final SupervisorService supervisorService;

    public SupervisorController(SupervisorService supervisorService) {
        this.supervisorService = supervisorService;
    }

//    @PostMapping
//    public ResponseEntity<Void> register(@Valid @RequestBody AdministratorCreateDTO requestDTO) {
//        this.administratorService.register(requestDTO.getName(), requestDTO.getEmail());
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }

    @GetMapping
    public ResponseEntity<List<SupervisorResponseDTO>> getAllSupervisors(){
        return new ResponseEntity<>(supervisorService.getSupervisors(), HttpStatus.OK);
    }

    @GetMapping({"/{email}"})
    public ResponseEntity<SupervisorResponseDTO> getSupervisor(@PathVariable String email){
        return new ResponseEntity<>(supervisorService.getSupervisorByEmail(email), HttpStatus.OK);
    }

    @PutMapping({"/{email}"})
    @PreAuthorize("hasAnyRole('ADMIN') or authentication.name == #email")
    public ResponseEntity<SupervisorResponseDTO> updateSupervisorByEmail(@PathVariable String email,
                                                                               @RequestBody @Valid SupervisorUpdateDTO supervisorUpdateDTO) {
        SupervisorResponseDTO supervisorResponseDTO = supervisorService.updateSupervisor(email, supervisorUpdateDTO);

        return new ResponseEntity<>(supervisorResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping({"/{email}"})
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteSupervisor(@PathVariable String email){
        supervisorService.deleteSupervisor(email);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
