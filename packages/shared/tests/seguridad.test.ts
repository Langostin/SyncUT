import { describe, expect, it } from "vitest";

import {
  validateEmail,
  validatePassword,
  validateRole,
} from "../src/validators";

describe("Seguridad - inyección SQL en el correo", () => {
  it.each([
    ["punto y coma", "alumno@utcj.edu.mx;DROP"],
    ["comentario de línea (--)", "alumno--@utcj.edu.mx"],
    ["comentario de bloque (/*)", "alumno/*@utcj.edu.mx"],
    ["payload clásico OR 1=1", "x'or'1'='1'--@utcj.edu.mx"],
    ["consulta encadenada", "a@b.mx;DELETE.FROM.profiles"],
  ])("bloquea un correo con %s", (_caso, email) => {
    const resultado = validateEmail(email);
    expect(resultado.valid).toBe(false);
    expect(resultado.errors).toContain(
      "Email contiene caracteres no permitidos"
    );
  });

  it("no confunde un correo legítimo con un intento de inyección", () => {
    expect(validateEmail("ana.lopez-ruiz@utcj.edu.mx").valid).toBe(true);
  });
});

describe("Seguridad - escalamiento de privilegios por rol", () => {
  it.each([
    ["mayúsculas", "ADMIN"],
    ["mayúscula inicial", "Admin"],
    ["espacios alrededor", " admin "],
    ["rol inventado", "superadmin"],
    ["rol concatenado", "student,admin"],
    ["inyección en el rol", "admin'; --"],
  ])("rechaza un rol manipulado (%s)", (_caso, rol) => {
    expect(validateRole(rol).valid).toBe(false);
  });

  it.each(["__proto__", "constructor", "toString"])(
    "rechaza nombres internos de JavaScript como rol: %s",
    (rol) => {
      expect(validateRole(rol).valid).toBe(false);
    }
  );
});

describe("Seguridad - contraseñas débiles", () => {
  it.each([
    ["solo números", "12345678"],
    ["palabra común", "password"],
    ["teclado", "qwertyui"],
    ["contraseña de demostración", "hunter2"],
    ["vacía", ""],
  ])("rechaza una contraseña débil (%s)", (_caso, password) => {
    expect(validatePassword(password).valid).toBe(false);
  });
});
