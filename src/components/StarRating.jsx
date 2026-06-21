export default function StarRating({ rating, size = 'md', animate = false }) {
  const fullStars = Math.floor(rating)
  const remainder = rating - fullStars
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const textSize = size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={`flex items-center gap-1.5 ${animate ? 'tracking-reveal' : ''}`}>
      <div className="star-rating">
        {[...Array(5)].map((_, i) => {
          let fill = 0
          if (i < fullStars) fill = 1
          else if (i === fullStars) fill = remainder
          const delay = animate ? `${i * 100}ms` : '0ms'

          return (
            <svg
              key={i}
              className={`${starSize} ${animate ? 'animate-star-pop' : ''}`}
              style={{ animationDelay: delay }}
              viewBox="0 0 20 20"
              fill="none"
            >
              <defs>
                <linearGradient id={`star-fill-${i}-${rating}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#ffe156" />
                  <stop offset={`${fill * 100}%`} stopColor="rgba(255,225,86,0.2)" />
                </linearGradient>
              </defs>
              <path
                d="M10 1l2.39 4.84L17.82 7l-3.91 3.81.92 5.38L10 13.47l-4.83 2.72.92-5.38L2.18 7l5.43-.79L10 1z"
                fill={`url(#star-fill-${i}-${rating})`}
                stroke="#ffe156"
                strokeWidth="0.8"
              />
            </svg>
          )
        })}
      </div>
      <span className={`font-body text-vhs-neon-yellow font-bold ${textSize}`}>
        {rating.toFixed(2)}
      </span>
    </div>
  )
}
