import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Image src="/logo-kateandoug-wordmark.svg" alt="Kate&Doug" width={220} height={70} />
      <SignIn
        appearance={{ variables: { colorPrimary: '#1434CB' } }}
      />
    </div>
  )
}
