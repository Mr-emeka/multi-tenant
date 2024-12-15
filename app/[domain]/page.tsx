import React from 'react'

export default async function Page({ params }: { params: { domain: string } }) {
    const { domain } = await params
  return (
    <div>Page {domain}</div>
  )
}
