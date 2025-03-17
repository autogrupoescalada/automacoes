// Type definitions for Next.js page props
declare namespace NextPage {
  interface PageProps {
    params: Record<string, string>;
    searchParams: Record<string, string | string[] | undefined>;
  }
}

export = NextPage; 