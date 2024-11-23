const Loading = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted-foreground border-t-primary"></div>
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary"></div>
      </div>
    </div>
  </div>
);

export default Loading;
