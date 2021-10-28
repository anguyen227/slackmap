import { FieldProps } from 'formik'
import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

export type TextInputP = Omit<TextFieldProps, 'variant'> & FieldProps

const TextInput = ({ field, form, meta, ...props }: TextInputP) => {
    const error = !!meta.error && meta.touched
    return <TextField {...props} {...field} error={error} helperText={(error && meta.error) || props.helperText} />
}

export default TextInput
