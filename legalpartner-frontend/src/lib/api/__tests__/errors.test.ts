import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  getApiErrorData,
  getApiErrorMessage,
  getErrorMessage,
} from '../errors';

function axiosError(status: number | undefined, data?: unknown, code?: string) {
  const err = new AxiosError('boom', code);
  if (status !== undefined) {
    err.response = {
      status,
      data,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
  }
  return err;
}

describe('getErrorMessage', () => {
  it('lee "error" como string (exception handler del backend)', () => {
    expect(
      getErrorMessage(
        { success: false, error: 'Has alcanzado tu límite mensual' },
        'x'
      )
    ).toBe('Has alcanzado tu límite mensual');
  });

  it('lee "error" como lista y como objeto {code, message}', () => {
    expect(
      getErrorMessage({ error: ['Archivo inválido', 'Muy grande'] }, 'x')
    ).toBe('Archivo inválido Muy grande');
    expect(
      getErrorMessage(
        { error: { code: 'X', message: 'Error al procesar', details: 'y' } },
        'x'
      )
    ).toBe('Error al procesar');
  });

  it('aplana "errors" de un serializer DRF', () => {
    expect(
      getErrorMessage(
        {
          errors: {
            email: ['Ya existe'],
            non_field_errors: ['Credenciales inválidas'],
          },
        },
        'x'
      )
    ).toBe('email: Ya existe Credenciales inválidas');
  });

  it('lee "message" (accounts) y "detail", y usa el fallback si no hay nada', () => {
    expect(getErrorMessage({ message: 'Verifica tu email' }, 'x')).toBe(
      'Verifica tu email'
    );
    expect(getErrorMessage({ detail: 'No encontrado' }, 'x')).toBe(
      'No encontrado'
    );
    expect(getErrorMessage({ success: true }, 'fallback')).toBe('fallback');
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
  });
});

describe('getApiErrorMessage', () => {
  it('prefiere el cuerpo de la respuesta', () => {
    expect(
      getApiErrorMessage(
        axiosError(403, { success: false, error: 'Límite diario' })
      )
    ).toBe('Límite diario');
  });

  it('distingue timeout, sin conexión y códigos HTTP sin cuerpo', () => {
    expect(
      getApiErrorMessage(axiosError(undefined, undefined, 'ECONNABORTED'))
    ).toMatch(/tardó demasiado/);
    expect(getApiErrorMessage(axiosError(undefined))).toMatch(/conectar/);
    expect(getApiErrorMessage(axiosError(401, {}))).toMatch(/sesión/);
    expect(getApiErrorMessage(axiosError(403, {}))).toMatch(/permiso/);
    expect(getApiErrorMessage(axiosError(500, {}), 'fallback')).toBe(
      'fallback'
    );
  });

  it('usa el fallback para errores que no son de axios', () => {
    expect(getApiErrorMessage(new Error('x'), 'fallback')).toBe('fallback');
  });
});

describe('getApiErrorData', () => {
  it('expone requires_verification del 403 de login', () => {
    const data = getApiErrorData(
      axiosError(403, {
        success: false,
        requires_verification: true,
        email: 'a@b.c',
      })
    );
    expect(data?.requires_verification).toBe(true);
    expect(data?.email).toBe('a@b.c');
    expect(getApiErrorData(new Error('x'))).toBeNull();
  });
});
