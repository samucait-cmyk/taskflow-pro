/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PomodoroTimer from './PomodoroTimer'

describe('PomodoroTimer Component', () => {
  it('deve renderizar o temporizador e o botão de iniciar', () => {
    render(<PomodoroTimer />)
    
    // Verifica se o botão "Iniciar" está presente no componente
    const startButton = screen.getByText(/iniciar/i)
    expect(startButton).toBeInTheDocument()

    // Verifica se o tempo padrão de 25:00 aparece na tela
    const timeDisplay = screen.getByText('25:00')
    expect(timeDisplay).toBeInTheDocument()
  })
})