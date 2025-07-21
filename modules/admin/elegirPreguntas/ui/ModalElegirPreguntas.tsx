/// Vista modal de usuario
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, DialogActions, DialogContent, Grid, Typography, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material'
import { FormInputText, FormInputDropdown } from '../../../../common/components/ui/form'
import ProgresoLineal from '../../../../common/components/ui/ProgresoLineal'
import { CategoriaCRUDType } from '../../categoria/types/categoriaCRUDTypes'
import { CrearEditarPreguntaConOpcionesType } from '../types/elegirPreguntasCRUDTypes'
import { useAlerts, useSession } from '../../../../common/hooks'
import { Constantes } from '../../../../config'
import { InterpreteMensajes } from '../../../../common/utils'
import { imprimir } from '../../../../common/utils/imprimir'

// Tipos para la pregunta y opciones
export interface OpcionPregunta {
  id?: string
  descripcion: string
  correcto: boolean
}

export interface PreguntaFormType {
  id?: string
  idCategoria: string
  descripcion: string
  opciones: OpcionPregunta[]
}

export interface ModalPreguntaType {
  categorias: CategoriaCRUDType[]
  pregunta?: PreguntaFormType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalPregunta = ({
  categorias,
  pregunta,
  accionCorrecta,
  accionCancelar,
}: ModalPreguntaType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  // Estado local para opciones y correcta
  const [opciones, setOpciones] = useState<{ id?: string, descripcion: string }[]>(
    pregunta?.opciones?.map(o => ({ id: o.id, descripcion: o.descripcion })) ||
    [
      { descripcion: '' },
      { descripcion: '' },
      { descripcion: '' },
      { descripcion: '' }
    ]
  );
  const [correcta, setCorrecta] = useState<number | null>(
    pregunta?.opciones?.findIndex(o => o.correcto) ?? null
  );

  const { handleSubmit, control } = useForm<PreguntaFormType>({
    defaultValues: {
      id: pregunta?.id || undefined,
      idCategoria: pregunta?.idCategoria || '',
      descripcion: pregunta?.descripcion || '',
      opciones: [], // Se arma manualmente al guardar
    },
  })
  console.log('Default values del form:', {
    id: pregunta?.id,
    idCategoria: pregunta?.idCategoria,
    descripcion: pregunta?.descripcion,
  });

  // Unificar validación y guardado
  const guardarActualizarPreguntas = async (
    data: PreguntaFormType
  ) => {
    console.log('Data enviada desde el form:', data);
    // Validación manual
    if (!data.idCategoria) {
      Alerta({ mensaje: 'Seleccione una categoría', variant: 'error' });
      return;
    }
    if (!data.descripcion?.trim()) {
      Alerta({ mensaje: 'Ingrese la pregunta', variant: 'error' });
      return;
    }
    if (opciones.some(o => !o.descripcion?.trim())) {
      Alerta({ mensaje: 'Complete todas las opciones', variant: 'error' });
      return;
    }
    if (correcta === null) {
      Alerta({ mensaje: 'Seleccione la opción correcta', variant: 'error' });
      return;
    }
    // Armar objeto para backend
    const preguntaEnviar: CrearEditarPreguntaConOpcionesType = {
      id: data.id || undefined, // si existe, es edición
      idCategoria: data.idCategoria,
      descripcion: data.descripcion,
      opciones: opciones.map((op, idx) => ({
        id: op.id,
        descripcion: op.descripcion,
        correcto: idx === correcta,
        orden: idx,
      })),
    };
    console.log('Objeto enviado al backend:', preguntaEnviar);
    await guardarActualizarPreguntaPeticion(preguntaEnviar);
  };

  const guardarActualizarPreguntaPeticion = async (
    preguntas: CrearEditarPreguntaConOpcionesType
  ) => {
    try {
      setLoadingModal(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas${
          preguntas.id ? `/${preguntas.id}` : ''
        }`,
        tipo: !!preguntas.id ? 'patch' : 'post',
        body: {
          ...preguntas,
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar Pregunta: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }
  return (
    <form onSubmit={handleSubmit(guardarActualizarPreguntas)}>
      <DialogContent dividers>
        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <FormInputDropdown
              id={'idCategoria'}
              name={'idCategoria'}
              control={control}
              label={'Categoría'}
              options={categorias.map(cat => ({
                key: cat.id,
                value: cat.id,
                label: cat.descripcion,
              }))}
              rules={{ required: 'Seleccione una categoría' }}
              disabled={loadingModal}
            />
          </Grid>
          <Grid item>
            <FormInputText
              id={'descripcion'}
              name={'descripcion'}
              control={control}
              label={'Pregunta'}
              rules={{ required: 'Ingrese la pregunta' }}
              disabled={loadingModal}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Opciones</Typography>
            <Grid container spacing={1}>
              {['a', 'b', 'c', 'd'].map((letra, idx) => (
                <Grid item xs={12} sm={6} key={letra}>
                  <TextField
                    label={`Opción ${letra}`}
                    value={opciones[idx]?.descripcion || ''}
                    onChange={e => {
                      const nuevas = [...opciones];
                      nuevas[idx] = { ...nuevas[idx], descripcion: e.target.value };
                      setOpciones(nuevas);
                    }}
                    disabled={loadingModal}
                    required
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Marque la opción correcta</Typography>
            <RadioGroup
              row
              value={correcta !== null ? correcta : ''}
              onChange={e => setCorrecta(Number(e.target.value))}
            >
              {['a', 'b', 'c', 'd'].map((letra, idx) => (
                <FormControlLabel
                  key={letra}
                  value={idx}
                  control={<Radio disabled={loadingModal} />}
                  label={`Opción ${letra}`}
                />
              ))}
            </RadioGroup>
          </Grid>
          <Grid item>
            <ProgresoLineal mostrar={loadingModal} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
