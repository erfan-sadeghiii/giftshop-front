import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

export function middleware(req) {
    const token = req.cookies.get('access')?.value
    const url = req.nextUrl.clone()

    const isDashboard = url.pathname.startsWith('/dashboard')
    const isAdmin = url.pathname.startsWith('/admin')

    // ---------------- Unauthenticated redirect ----------------
    if (!token) {
        if (isDashboard || isAdmin) {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    // ---------------- Token exists → Decode ----------------
    try {
        const decoded = jwtDecode(token)
        const role = decoded.role

        // Protect admin routes
        if (isAdmin) {
            if (role !== 'admin' && role !== 'owner') {
                url.pathname = '/403'
                return NextResponse.redirect(url)
            }
        }

        return NextResponse.next()

    } catch (err) {
        console.error('Invalid or expired JWT:', err)
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
