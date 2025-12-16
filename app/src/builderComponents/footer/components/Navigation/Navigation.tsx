import * as React from "react";
import { Link } from "gatsby";

const Navigation = ({ localizationCode, options }: { localizationCode: string; options: any }) => (
  <div className='footer__links'>
    {options.map(
      (
        {
          path: {
            parent: { options },
          },
        },
        idx: number
      ) => (
        <div className='asd' key={`section-${idx}`}>
          {options?.map((item: any, index: number) => {
            if (item.isExternal) {
              return (
                <a
                  key={`section-${idx}-item${index}`}
                  className='footer__links__link'
                  href={item.path}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {item.icon ? <img src={item.icon} alt={item.name} width='120px' /> : item.name}
                </a>
              );
            }
            return (
              <Link
                key={`section-${idx}-item${index}`}
                to={`${localizationCode && `/${localizationCode}`}${item.path}`}
                className='footer__links__link'
              >
                {item.icon ? <img src={item.icon} width='80%' alt={item.name} /> : item.name}
              </Link>
            );
          })}
        </div>
      )
    )}
  </div>
);

export default Navigation;
