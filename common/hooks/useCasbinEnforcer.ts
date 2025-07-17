import { PoliticaType } from '../../modules/login/types/loginTypes'
import { Enforcer } from 'casbin'
import { imprimir } from '../utils/imprimir'
import { basicModel, basicPolicy } from '../utils/casbin'

export const useCasbinEnforcer = () => {
  interface VerificarAutorizacionType {
    enforcer?: Enforcer
    politica?: PoliticaType
  }

  const inicializarCasbin = async (politicas: string[][]) => {
    const casbinLib = await import('casbin')
    imprimir(`casbinLib 🪄`, casbinLib)

    const model = casbinLib.newModelFromString(basicModel)
    const policy = new casbinLib.StringAdapter(basicPolicy)
    const enforcerTemp: Enforcer = await casbinLib.newEnforcer(model, policy)
    for await (const p of politicas) {
      await enforcerTemp.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5])
    }
    return enforcerTemp
  }

  const verificarAutorizacion = async ({
    enforcer,
    politica,
  }: VerificarAutorizacionType): Promise<boolean> => {
    return (
      (await enforcer?.enforce(
        politica?.sujeto,
        politica?.objeto,
        politica?.accion
      )) ?? false
    )
  }
  const interpretarPermiso = async (
    routerName: string,
    enforcer?: Enforcer,
    rol?: string
  ) => {
    if (!rol) {
      return {
        read: false,
        create: false,
        update: false,
        delete: false,
      }
    }

    return {
      read: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol,
          objeto: routerName,
          accion: 'read',
        },
      }),
      create: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol,
          objeto: routerName,
          accion: 'create',
        },
      }),
      update: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol,
          objeto: routerName,
          accion: 'update',
        },
      }),
      delete: await verificarAutorizacion({
        enforcer: enforcer,
        politica: {
          sujeto: rol,
          objeto: routerName,
          accion: 'delete',
        },
      }),
    }
  }
  return { inicializarCasbin, interpretarPermiso }
}
