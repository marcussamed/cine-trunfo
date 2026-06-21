import { t } from '../i18n'

export default function StatsModal({ stats, onClose, lang }) {
  const winRate = stats.totalGames > 0
    ? Math.round((stats.wins / stats.totalGames) * 100)
    : 0

  const items = [
    { label: t(lang, 'played'), value: stats.totalGames },
    { label: t(lang, 'winPct'), value: `${winRate}%` },
    { label: t(lang, 'bestScore'), value: stats.bestScore > 0 ? stats.bestScore.toFixed(2) : '—' },
    { label: t(lang, 'streak'), value: stats.currentStreak },
    { label: t(lang, 'bestStreak'), value: stats.bestStreak },
  ]

  return (
    <div
      className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-vhs-dark border border-vhs-tape/40 rounded-2xl p-6 w-full max-w-[320px]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-sm text-center text-vhs-neon-cyan neon-text mb-5">
          {t(lang, 'yourStats').toUpperCase()}
        </h2>

        <div className="flex justify-between gap-2 mb-6">
          {items.map(item => (
            <div key={item.label} className="text-center flex-1">
              <p className="font-display text-lg text-white">{item.value}</p>
              <p className="font-body text-vhs-label/50 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="font-body text-base text-vhs-neon-blue w-full py-2 border border-vhs-neon-blue/30 rounded-lg active:bg-vhs-neon-blue/10 transition-colors"
        >
          {t(lang, 'close')}
        </button>
      </div>
    </div>
  )
}
