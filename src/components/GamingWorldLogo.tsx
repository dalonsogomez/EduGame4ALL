interface GamingWorldLogoProps {
  size?: number;
  className?: string;
}

export function GamingWorldLogo({ size = 200, className = "" }: GamingWorldLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Globo terráqueo */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#earthGradient)"
        stroke="#1e40af"
        strokeWidth="3"
      />
      
      {/* Gradiente para el globo */}
      <defs>
        <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="controllerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      
      {/* Líneas de latitud */}
      <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="100" cy="100" rx="80" ry="50" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
      
      {/* Líneas de longitud */}
      <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="100" cy="100" rx="50" ry="80" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
      <line x1="100" y1="20" x2="100" y2="180" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
      
      {/* Continentes estilizados (formas abstractas) */}
      <path
        d="M 80 60 Q 90 55 100 60 T 120 65 L 125 75 Q 120 80 115 75 L 105 80 Q 95 75 85 70 Z"
        fill="#93c5fd"
        opacity="0.8"
      />
      <path
        d="M 70 110 Q 75 105 85 108 L 95 115 Q 90 120 80 118 Z"
        fill="#93c5fd"
        opacity="0.8"
      />
      <path
        d="M 120 120 Q 130 118 138 125 L 140 135 Q 135 138 128 133 Z"
        fill="#93c5fd"
        opacity="0.8"
      />
      
      {/* Mando de videojuegos en la parte inferior */}
      <g transform="translate(100, 165)">
        {/* Base del mando */}
        <rect
          x="-35"
          y="-15"
          width="70"
          height="30"
          rx="8"
          fill="url(#controllerGradient)"
          stroke="#991b1b"
          strokeWidth="2"
        />
        
        {/* Agarre izquierdo */}
        <path
          d="M -35 -5 Q -45 0 -48 10 L -45 15 L -35 15"
          fill="url(#controllerGradient)"
          stroke="#991b1b"
          strokeWidth="2"
        />
        
        {/* Agarre derecho */}
        <path
          d="M 35 -5 Q 45 0 48 10 L 45 15 L 35 15"
          fill="url(#controllerGradient)"
          stroke="#991b1b"
          strokeWidth="2"
        />
        
        {/* D-pad (cruceta izquierda) */}
        <g transform="translate(-20, 0)">
          <rect x="-1.5" y="-6" width="3" height="12" fill="#fca5a5" rx="0.5" />
          <rect x="-6" y="-1.5" width="12" height="3" fill="#fca5a5" rx="0.5" />
        </g>
        
        {/* Botones de acción (derecha) */}
        <circle cx="15" cy="-5" r="3" fill="#fca5a5" />
        <circle cx="23" cy="0" r="3" fill="#fca5a5" />
        <circle cx="15" cy="5" r="3" fill="#fca5a5" />
        <circle cx="7" cy="0" r="3" fill="#fca5a5" />
        
        {/* Joystick */}
        <circle cx="0" cy="0" r="4" fill="#7c2d12" stroke="#fca5a5" strokeWidth="1" />
      </g>
      
      {/* Brillo en el globo */}
      <ellipse
        cx="75"
        cy="75"
        rx="25"
        ry="20"
        fill="white"
        opacity="0.15"
      />
    </svg>
  );
}
