export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-black/[0.07] bg-white animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="flex gap-1">
          <div className="h-4 w-10 bg-gray-200 rounded-[3px]" />
          <div className="h-4 w-10 bg-gray-200 rounded-[3px]" />
          <div className="h-4 w-10 bg-gray-200 rounded-[3px]" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
