import { describe, expect, it } from "vitest";

import {
  VALID_ROLES,
  validateEmail,
  validatePassword,
  validateRole,
} from "../src/validators";

describe("Autenticación - validación de correo", () => {
  it.each([
    "alumno@utcj.edu.mx",
    "tutor.grupo@utcj.edu.mx",
    "admin@syncut.io",
  ])("acepta un correo con formato válido: %s", (email) => {
    expect(validateEmail(email)).toEqual({ valid: true });
  });

  it.each([
    ["sin arroba", "alumno.utcj.edu.mx"],
    ["sin dominio", "alumno@"],
    ["sin usuario", "@utcj.edu.mx"],
    ["sin extensión de dominio", "alumno@utcj"],
    ["con espacios", "alumno @utcj.edu.mx"],
    ["vacío", ""],
  ])("rechaza un correo %s", (_caso, email) => {
    const resultado = validateEmail(email);
    expect(resultado.valid).toBe(false);
    expect(resultado.errors).toContain("Email inválido");
  });
});

describe("Autenticación - política de contraseñas", () => {
  it("acepta una contraseña que cumple todas las reglas", () => {
    expect(validatePassword("SyncUT2026")).toEqual({
      valid: true,
      errors: undefined,
    });
  });

  it("exige un mínimo de 8 caracteres", () => {
    expect(validatePassword("Ab1").errors).toContain("Mínimo 8 caracteres");
  });

  it("exige al menos una mayúscula", () => {
    expect(validatePassword("syncut2026").errors).toContain(
      "Debe contener mayúsculas"
    );
  });

  it("exige al menos una minúscula", () => {
    expect(validatePassword("SYNCUT2026").errors).toContain(
      "Debe contener minúsculas"
    );
  });

  it("exige al menos un número", () => {
    expect(validatePassword("SyncUTutcj").errors).toContain(
      "Debe contener números"
    );
  });

  it("reporta todas las reglas incumplidas a la vez", () => {
    const resultado = validatePassword("abc");
    expect(resultado.valid).toBe(false);
    expect(resultado.errors).toEqual([
      "Mínimo 8 caracteres",
      "Debe contener mayúsculas",
      "Debe contener números",
    ]);
  });
});

describe("Autenticación - roles de la plataforma", () => {
  it.each(VALID_ROLES)("acepta el rol válido: %s", (rol) => {
    expect(validateRole(rol)).toEqual({ valid: true });
  });

  it("define exactamente los cinco roles de SyncUT", () => {
    expect([...VALID_ROLES]).toEqual([
      "student",
      "teacher",
      "tutor",
      "admin",
      "coordinator",
    ]);
  });

  it.each(["guest", "", "alumno"])("rechaza un rol desconocido: '%s'", (rol) => {
    const resultado = validateRole(rol);
    expect(resultado.valid).toBe(false);
    expect(resultado.errors?.[0]).toMatch(/^Role debe ser uno de:/);
  });
});
