import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    console.log('Received registration request:', { name, email })
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log('Attempting to create user...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })
    console.log('User created successfully:', user.id)

    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 