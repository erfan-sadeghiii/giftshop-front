import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'


export function middleware(req) {
    const token = req.cookies.get('access2')?.value
    const url = req.nextUrl.clone()

    // redirect if not logged in
    if (!token && url.pathname.startsWith('/dashboard')) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (token) {
        try {
            // decode payload without verifying signature
            const decoded = jwtDecode(token)
            const role = decoded.role
           

            // protect admin routes
            if (url.pathname.startsWith('/admin') && role == 'user' ) {
                url.pathname = '/403' // or your unauthorized page
                return NextResponse.redirect(url)
            }
        } catch (err) {
            console.error('Invalid JWT', err)
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    } else if (url.pathname.startsWith('/admin')) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
