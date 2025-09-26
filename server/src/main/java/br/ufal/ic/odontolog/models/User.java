package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements UserDetails {
  // TODO: Add UserDetails and other Spring Security related fields
  @Id @GeneratedValue @UuidGenerator private UUID id;

  @Enumerated(EnumType.STRING)
  private Role role;

  private String name;
  private String email;
  private String password;

  @Column String photoUrl;

  @Column(nullable = false, columnDefinition = "boolean default false")
  boolean deleted = false;

  public User(String name, String email, String password, Role role, String photoUrl) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.photoUrl = photoUrl;
  }

  @Override
  @JsonIgnore
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if (role == null) return List.of();
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override
  @JsonIgnore
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  @JsonIgnore
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isEnabled() {
    return !deleted;
  }
}
