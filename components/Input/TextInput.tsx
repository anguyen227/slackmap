import { FieldProps } from 'formik'
import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

export type TextInputP = Omit<TextFieldProps, 'variant'> & FieldProps

const TextInput = ({ field, form, meta, ...props }: TextInputP) => {
    return (
        <TextField
            {...props}
            {...field}
            error={!!meta.error && meta.touched}
            helperText={meta.error || props.helperText}
        />
    )
}

export default TextInput
