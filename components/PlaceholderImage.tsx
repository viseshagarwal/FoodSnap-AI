export default function PlaceholderImage() {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-orange-500">
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500">App Screenshot</p>
      </div>
    </div>
  )
} 