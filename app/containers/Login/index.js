/*
 * Login Page
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { Anchor, Box, TextInput, Button, FormField } from 'grommet';
import Header from '../../components/Header';
import { post } from '../../apis/generics';

function LoginPage() {
  // TODO: if there is access token in the localStorage, redirect user to home page

  const history = useHistory();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onClickLoginButton = () => {
    post('login', { username, password })
      .then(({ token }) => {
        if (token) {
          localStorage.setItem('token', token);
          history.push('/');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goToRegisterPage = () => {
    history.push('/register');
  };

  return (
    <Box>
      <Header />
      <form onSubmit={handleSubmit(onClickLoginButton)}>
        <FormField>
          <TextInput
            {...register('username', {
              required: 'Username is required.',
              minLength: {
                value: 2,
                message: 'Username has to be more than 1 character',
              },
            })}
            placeholder="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </FormField>
        <ErrorMessage errors={errors} name="username" />
        <FormField>
          <TextInput
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 7,
                message: 'Check your password',
              },
            })}
            placeholder="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            type="password"
          />
        </FormField>
        <ErrorMessage errors={errors} name="password" />
        <br />
        <Button type="submit" primary label="Login" />
        <Anchor onClick={goToRegisterPage} label="Register" />
      </form>
    </Box>
  );
}

export default LoginPage;
