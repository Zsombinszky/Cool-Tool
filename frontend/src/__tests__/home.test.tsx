import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from '@/routes' // src/routes/index.tsx-ből

describe('Home route', () => {
  it('shows greeting text', () => {
    render(<HomePage />)

    expect(screen.getByText('Hello 👋')).toBeInTheDocument()
  })
})
