

export function Footer() {
  const linkPart1 = ["About", "Carerrs", "Contact"];
  const linkPart2 = ["Learn", "Guid", "Support", "Documentation"];
  const linkPart3 = ["BP Token", "Lending", "Vault", "Backpack Wallet", "Solana Wallet", "Sui Wallet", "Monad Wallet"];
  const linkPart4 = ["BTC to USD", 
    "ETH to USD", 
    "SOL to USD", 
    "BP to USD", 
    "HYPE to USD", 
    "BNB to USD", 
    "All Crypto Markets"
  ];
  const linkPart5 = ["Solana Price", 
    "Bitcoin Price", 
    "Ethereum Price", 
    "Sui Price", 
    "Monad Price", 
    "Backpack Price", 
    "All Crypto Prices"
  ];

  return (
    <div className="w-full flex flex-col py-10 px-30 bg-[#14151B] border-t border-gray-800">

      <div className="flex w-full items-center">
        <div className="flex gap-2 items-center justify-center mb-40">
          <svg width="20" viewBox="-1 -1 281 408" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M248.564 294.219C262.912 294.219 270.086 294.219 274.542 298.676C279 303.133 279 310.307 279 324.655V344.946C279 373.641 279 387.989 270.086 396.905C261.171 405.819 246.822 405.819 218.127 405.819H60.8727C32.1771 405.819 17.829 405.819 8.91443 396.905C-0.000175972 387.989 0 373.641 0 344.946V324.655C0 310.307 -8.88933e-05 303.133 4.45722 298.676C8.91452 294.219 16.0885 294.219 30.4364 294.219H248.564Z" fill="#E33E3F"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M139.5 59.6055C281.03 59.6055 279 153.957 279 199.105C279 244.254 279 244.254 279 244.254C279 252.658 272.186 259.472 263.781 259.472H15.2178C6.81304 259.472 -0.000373644 252.658 -0.000373705 244.254C-0.000373705 244.254 -0.000374154 244.254 -0.000373705 199.105C-0.000373255 153.957 -2.03073 59.6055 139.5 59.6055ZM139.5 95.5579C115.686 95.5579 96.3814 114.863 96.3814 138.677C139.5 181.795 163.314 181.795 182.618 181.795C182.618 162.489 163.314 95.5579 139.5 95.5579Z" fill="#E33E3F"></path>
            <path d="M139.46 1.11719C169.999 1.11719 196.733 11.7913 203.803 29.1745C204.868 32.1737 205.399 33.6736 204.453 34.7872C203.506 35.9008 201.675 35.5689 198.011 34.9049C188.543 33.1888 175.138 32.0087 163.336 31.6601C155.806 31.2554 147.862 31.0458 139.503 31.0458C131.149 31.0458 123.208 31.2558 115.682 31.6601C103.823 32.0086 90.371 33.1884 80.8685 34.8467C77.2829 35.4724 75.4894 35.7847 74.5499 34.6744C73.6104 33.5639 74.1298 32.0914 75.1692 29.1472C82.1822 11.8188 108.93 1.11728 139.46 1.11719Z" fill="#E33E3F"></path>
          </svg>

          <p className="font-bold text-lg mt-1">Backpack</p>
        </div>

        <div className="w-full flex justify-between px-20">
          <FooterLinks mainLink="Company" links={linkPart1} />
          <FooterLinks mainLink="Help & Support" links={linkPart2} />
          <FooterLinks mainLink="Products" links={linkPart3} />
          <FooterLinks mainLink="Crypto Markets" links={linkPart4} />
          <FooterLinks mainLink="Token Prices" links={linkPart5} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-5">

        <div className="flex items-center gap-4 text-xs">
          <h6 className="text-white">Backpack Exchange © 2026</h6>
          <h6 className="text-gray-400">Legal</h6>
          <h6 className="text-gray-400">Privacy</h6>
        </div>
        <div className="flex gap-4 text-2xl pr-20 text-gray-400">
          <i className="fa-brands fa-x-twitter"></i>
          <i className="fa-brands fa-discord"></i>
          <i className="fa-brands fa-linkedin"></i>
          <i className="fa-brands fa-reddit"></i>
        </div>
      </div>

      <p className="text-gray-400 text-xs pt-2">Backpack is a financial services platform, not a bank. Banking services are provided by Backpack's bank partners.</p>
    </div>
  )
}

interface Links {
  mainLink: string,
  links: string[]
}

function FooterLinks({mainLink, links} : Links) {
  return (
    <div className="flex flex-col gap-2">
      <h5 className="text-white text-xs">{mainLink}</h5>
      { links.map((link, index) => <h5 key={index} className="text-[#75798A] text-xs">{link}</h5> )}
    </div>
  )
}