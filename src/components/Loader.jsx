function Loader() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        {/* Spinning Loader */}
        <div className='relative h-16 w-16'>
          <div className='absolute inset-0 rounded-full border-4 border-zinc-200'></div>
          <div className='absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#803385] border-r-[#803385]'></div>
        </div>
        <p className='text-sm font-medium text-zinc-600'>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
