import React from 'react';
import {Container} from "../components/Container";
import styled from "styled-components";
import {SubmitHandler, useForm} from "react-hook-form";
import {LoginFormInput} from "../types/Forms";
import axios from "axios";
import {Button, Form, Input} from "../components/FormContainer";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "react-use";

const Title = styled.h1``

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LoginPage: React.FC = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>()
    const navigate = useNavigate()
    const [, setUser] = useLocalStorage('user', "")

    const onLogin: SubmitHandler<LoginFormInput> = async (data) => {

        const requestBody = {
            email: data.email,
            password: data.password
        }

        try {
            await axios.post('http://localhost:8080/server/coursework/api/auth', requestBody).then((res) => {
                setUser(res.data)
                navigate("/")
                navigate(0)
            })
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                alert('Ошибка авторизации: Неверное имя пользователя или пароль')
            } else {
                alert(`Произошла ошибка при отправке запроса: ${error.message}`)
            }
        }
    }

    // {...register('username', {
    //     required: 'Имя пользователя обязательно',
    //     pattern: {
    //         value: /^[A-ZА-Я]\w*$/,
    //         message: 'Имя пользователя должно начинаться с заглавной буквы'
    //     }
    // })}

    return (
        <Container>
            <Main>
                <Title>Войти в аккаунт</Title>
                <Form onSubmit={handleSubmit(onLogin)}>
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="Имя пользователя"
                    />
                    {errors.email && <p style={{color: "red", textAlign: "center"}}>{errors.email.message}</p>}
                    <Input
                        {...register('password', {
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 8,
                                message: 'Пароль должен содержать не менее 8 символов'
                            }
                        })}
                        type="password"
                        placeholder="Пароль"
                    />
                    {errors.password && <p style={{color: "red", textAlign: "center"}}>{errors.password.message}</p>}
                    <Button type="submit">Войти</Button>
                </Form>
            </Main>
        </Container>
    )
}

export default LoginPage
