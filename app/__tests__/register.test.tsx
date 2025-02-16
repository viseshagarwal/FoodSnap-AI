import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from '../register/page'

const mockPush = jest.fn()
const mockReplace = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Mock Logo component
jest.mock('@/components/Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-logo">Logo</div>,
}))

// Mock Footer component
jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-footer">Footer</div>,
}))

describe('Register Page', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockReplace.mockClear()
    global.fetch = jest.fn()
  })

  it('renders the registration form', () => {
    render(<RegisterPage />)
    
    // Check for main elements
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<RegisterPage />)
    
    expect(screen.getByText(/already have an account/i, { selector: 'span.hidden' })).toBeInTheDocument()
    const signInButton = screen.getAllByRole('link', { name: /sign in/i })[0]
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveClass('bg-indigo-600')
  })

  it('shows validation error when form is submitted without data', async () => {
    render(<RegisterPage />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter your name/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter your email/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter your password/i)).toBeInTheDocument()
    })
  })

  it('handles successful registration', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock

    render(<RegisterPage />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Accept terms
    fireEvent.click(screen.getByLabelText(/i agree to the/i))
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object))
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles registration failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already exists' }),
      })
    ) as jest.Mock

    render(<RegisterPage />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'existing@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Accept terms
    fireEvent.click(screen.getByLabelText(/i agree to the/i))
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    
    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument()
  })

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<RegisterPage />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Accept terms
    fireEvent.click(screen.getByLabelText(/i agree to the/i))
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    
    expect(await screen.findByText(/an unexpected error occurred/i)).toBeInTheDocument()
  })

  it('toggles loading state during form submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    )

    render(<RegisterPage />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Accept terms
    fireEvent.click(screen.getByLabelText(/i agree to the/i))
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    
    // Check loading state
    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/creating account/i)).not.toBeInTheDocument()
    })
  })

  it('requires terms acceptance', async () => {
    render(<RegisterPage />)
    
    // Fill in the form but don't accept terms
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Try to submit
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    
    // Form should not submit without terms acceptance
    expect(global.fetch).not.toHaveBeenCalled()
  })
}) 