
export default function Machine({
  inputUrl = '',
  busy,
  result,
  copied,
  open,
  onCopy,
  onPackageClick
}) {
  const shortCode =
    result?.shortCode ||
    result?.code ||
    result?.shortUrl?.split('/').pop() ||
    'your link';

  return (
    <div
      className={`machine-wrap${busy ? ' is-busy' : ''}${result ? ' has-result' : ''}${open && result ? ' package-open' : ''}`}
      aria-label="Animated URL shortening machine"
    >
      <svg
        className="machine-svg"
        viewBox="0 0 1200 360"
        role="img"
        aria-labelledby="machine-title"
      >
        <title id="machine-title">
          LinkVault hydraulic press, conveyor and package
        </title>

        <defs>
          <pattern
            id="machine-hazard"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <rect width="18" height="18" fill="#ffb72e" />
            <path
              d="M-4 18L18-4M5 23L23 5"
              stroke="#252832"
              strokeWidth="7"
            />
          </pattern>
        </defs>

        {/* Input station */}
        <g transform="translate(20 72)">
          <rect width="310" height="235" rx="24" fill="#292c35" />
          <path
            d="M25 0H265Q310 0 310 44V62H0V25Q0 0 25 0Z"
            fill="#20232c"
          />
          <rect x="25" y="35" width="260" height="155" rx="15" fill="#171a22" />

          <path
            d="M120 -12V-28Q120 -44 136 -44Q152 -44 152 -28V-12Z"
            fill="#ff4b25"
            stroke="#242731"
            strokeWidth="5"
          />

          <g className="machine-signal">
            <path
              d="M136 -58V-70M112 -51L104 -60M160 -51L168 -60"
              stroke="#ff4b25"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          <text x="43" y="27" fill="#aeb2bc" fontSize="11" fontWeight="700" letterSpacing="1.2">
            LINK INPUT
          </text>
          <text x="43" y="78" fill="#fffdfa" fontSize="15" fontWeight="700">
            {inputUrl.trim() ? 'LINK INSERTED' : 'WAITING FOR LINK'}
          </text>
          <text x="43" y="108" fill={inputUrl.trim() ? '#ffb72e' : '#777b83'} fontSize="12" fontWeight="500">
            {inputUrl.trim() ? (inputUrl.length > 31 ? `${inputUrl.slice(0, 28)}…` : inputUrl) : 'Paste a URL above'}
          </text>
          <path d="M43 126H278" stroke="#343842" strokeWidth="2" />
          <circle cx="49" cy="145" r="4" fill={busy ? '#ffb72e' : '#ff4b25'} />
          <text x="61" y="149" fill="#aeb2bc" fontSize="10" fontWeight="600">
            {busy ? 'PRESS IN PROGRESS' : result ? 'LINK COMPRESSED' : 'READY TO PRESS'}
          </text>
          <path
            d="M175 164h17m-6-6l6 6-6 6"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M36 207H112M36 220H112"
            stroke="#11141b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M240 207v12m12-12v12m12-12v12m12-12v12"
            stroke="#11141b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Conveyor */}
        <rect x="310" y="255" width="865" height="38" rx="19" fill="#292c35" />
        <rect x="325" y="262" width="835" height="4" rx="2" fill="#454954" />

        {[330, 375, 420, 465, 510, 555, 600, 645, 690, 735, 780, 825, 870, 915, 960, 1005, 1050, 1095, 1140].map((x) => (
          <g key={x}>
            <circle cx={x} cy="274" r="8" fill="#454954" />
            <circle className="machine-roller" cx={x} cy="274" r="3" fill="#1d2028" />
          </g>
        ))}

        {/* Support feet */}
        {[430, 760, 1065].map((x) => (
          <g key={x}>
            <path
              d={`M${x} 293v20`}
              stroke="#292c35"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <rect x={x - 20} y="310" width="40" height="7" rx="3" fill="#292c35" />
          </g>
        ))}

        {/* Hydraulic press */}
        <g>
          <rect
            x="500"
            y="45"
            width="250"
            height="35"
            rx="6"
            fill="#ffb72e"
            stroke="#292c35"
            strokeWidth="5"
          />
          <rect x="505" y="48" width="46" height="24" rx="3" fill="#292c35" />
          <rect x="699" y="48" width="46" height="24" rx="3" fill="#292c35" />
          <rect x="515" y="75" width="29" height="165" rx="5" fill="#292c35" />
          <rect x="706" y="75" width="29" height="165" rx="5" fill="#292c35" />
          <rect x="594" y="75" width="62" height="22" rx="4" fill="#292c35" />

          <g className="machine-press-head">
            <rect
              x="612"
              y="85"
              width="26"
              height="45"
              rx="4"
              fill="#777b83"
              stroke="#292c35"
              strokeWidth="4"
            />
            <rect x="599" y="124" width="52" height="13" rx="3" fill="#292c35" />
            <rect
              x="570"
              y="137"
              width="110"
              height="27"
              rx="4"
              fill="url(#machine-hazard)"
              stroke="#292c35"
              strokeWidth="4"
            />
          </g>

          <rect x="500" y="235" width="250" height="18" rx="5" fill="#292c35" />
        </g>

        {/* URL card travelling along the conveyor */}
        <g className="machine-url-card">
          <rect
            x="348"
            y="205"
            width="140"
            height="42"
            rx="10"
            fill="#fffdfa"
            stroke="#d7d8dc"
            strokeWidth="4"
          />
          <path
            d="M370 224l8-8a7 7 0 0 1 10 10l-3 3m-1 3l-8 8a7 7 0 0 1-10-10l3-3"
            fill="none"
            stroke="#292c35"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="398" y="230" fill="#292c35" fontSize="15" fontWeight="700">
            https://
          </text>
        </g>

        {/* Output package */}
        <g
          className="machine-package"
          onClick={result ? onPackageClick : undefined}
          role={result ? 'button' : undefined}
          tabIndex={result ? 0 : undefined}
          aria-label={result ? 'Open package and copy short link' : 'Waiting for a shortened link'}
          onKeyDown={(event) => {
            if (result && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              onPackageClick?.();
            }
          }}
        >
          <rect x="930" y="100" width="225" height="155" rx="18" fill="#292c35" />
          <rect x="950" y="123" width="185" height="110" rx="10" fill="#171a22" />
          <g className="package-closed">
            <rect x="953" y="118" width="179" height="116" rx="5" fill="#ff9f1a" stroke="#292c35" strokeWidth="5" />
            <rect x="944" y="101" width="197" height="34" rx="4" fill="#ffb72e" stroke="#292c35" strokeWidth="5" />
            <rect x="1020" y="215" width="40" height="13" rx="3" fill="#d9d9d9" stroke="#292c35" strokeWidth="3" />
          </g>

          <path
            className="package-flap package-flap-left"
            d="M950 142L916 129L945 188L978 180Z"
            fill="#ffb72e"
          />
          <path
            className="package-flap package-flap-right"
            d="M1135 142L1168 129L1140 188L1107 180Z"
            fill="#ffb72e"
          />
          <path
            className="package-flap package-flap-bottom-left"
            d="M950 190L934 232L990 217L1005 188Z"
            fill="#ff9b22"
          />
          <path
            className="package-flap package-flap-bottom-right"
            d="M1135 190L1151 232L1095 217L1080 188Z"
            fill="#ff9b22"
          />

          <rect x="977" y="164" width="130" height="43" rx="10" fill="#fffdfa" />

          <g className="package-placeholder">
            <path
              d="M1004 180l-5 5a6 6 0 0 1-9-8l7-7a6 6 0 0 1 9 0m-3 13l5-5a6 6 0 0 1 9 8l-7 7a6 6 0 0 1-9 0"
              fill="none"
              stroke="#292c35"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="1030" y="190" fill="#171a22" fontSize="12" fontWeight="700">
              your link
            </text>
          </g>

          <g className="package-result">
            <text x="990" y="190" fill="#171a22" fontSize="13" fontWeight="700">
              {shortCode.length > 12 ? `${shortCode.slice(0, 10)}…` : shortCode}
            </text>
            {copied ? (
              <path
                d="M1080 184l4 4 8-9"
                fill="none"
                stroke="#23834c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M1080 177h10v12h-10zM1084 174h10v12"
                fill="none"
                stroke="#171a22"
                strokeWidth="2"
              />
            )}
          </g>

          <rect x="1004" y="104" width="78" height="6" rx="3" fill="#ffb72e" />
          {result && !busy && (
  <g className="package-ready-label">
    <rect
      x="982"
      y="70"
      width="120"
      height="26"
      rx="6"
      fill="#23834c"
    />
    <text
      x="1042"
      y="87"
      textAnchor="middle"
      fill="#fffdfa"
      fontSize="12"
      fontWeight="800"
      letterSpacing="1"
    >
      ✓ PACKED
    </text>
  </g>
)}
        </g>
      </svg>

      <div className="machine-mobile-note">
        <span>01</span> Paste <i>→</i> <span>02</span> Press <i>→</i> <span>03</span> Pack
      </div>

      {result && (
        <button
          type="button"
          className="machine-copy-action"
          onClick={onCopy}
        >
          {copied ? 'Copied!' : 'Copy short link'}
        </button>
      )}
    </div>
  );
}
