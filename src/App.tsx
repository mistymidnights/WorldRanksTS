import './App.css';
import { useState, useEffect } from 'react';
import Logo from '/Logo.svg';
import Search from '/Search.svg';
import { FaGithub } from 'react-icons/fa';

function App() {
  const [countries, setCountries] = useState<any[]>([]);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [showIndependent, setShowIndependent] = useState<boolean>(false);
  const [showUNMember, setShowUNMember] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>('Population');
  const [searchText, setSearchText] = useState<string>('');

  const urlBase: string = 'https://restcountries.com/v3.1/';

  const fetchData = async (url: string, region: string) => {
    try {
      setActiveRegion(region);
      const response = await fetch(`${url}${region}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        let formattedCountries = data.map((country: any) => ({
          ...country,
          originalPopulation: formatNumber(country.population),
          originalArea: formatNumber(country.area),
          area: country.area
            ? country.area.toString().replace(/\,/g, /\./g, '').toLocaleString()
            : 'N/A',
          population: country.population
            ? country.population
                .toString()
                .replace(/\,/g, /\./g, '')
                .toLocaleString()
            : 'N/A',
        }));

        if (showIndependent) {
          formattedCountries = formattedCountries.filter(
            (country: any) => country.independent
          );
        }

        if (showUNMember) {
          formattedCountries = formattedCountries.filter(
            (country: any) => country.unMember
          );
        }

        if (orderBy !== '') {
          formattedCountries = orderByPopulationOrArea(
            formattedCountries,
            orderBy
          );
        }

        if (searchText !== '') {
          formattedCountries = formattedCountries.filter((country: any) =>
            country.name.common.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        setCountries(formattedCountries);
      } else {
        console.error('Unexpected data format received:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const orderByPopulationOrArea = (countries: any[], order: string) => {
    return countries.sort((a: any, b: any) => {
      if (order === 'Population') {
        return b.population - a.population;
      } else if (order === 'Area') {
        return b.area - a.area;
      }
      return 0;
    });
  };

  const formatNumber = (number: number | undefined) => {
    if (number !== undefined) {
      return number.toLocaleString('en-US');
    }
    return 'N/A';
  };

  useEffect(() => {
    fetchData(urlBase, 'all');
  }, [showIndependent, showUNMember, orderBy, searchText]);

  return (
    <>
      <div className='header'>
        <img src='./hero-image-wr.jpg' alt='' />
        <div className='content'>
          <img src={Logo} alt='React Logo' />
          <div className='copy'>
            <a
              href='https://github.com/mistymidnights/WorldRanksTS'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub />
            </a>
            Cristina Lopez
          </div>
        </div>
      </div>

      <div className='list-items-container'>
        {countries.length > 0 ? (
          <>
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-12'>
                  <div className='search-content d-flex align-items-center justify-content-between'>
                    <p>Found {countries.length} countries</p>

                    <form className='form-inline my-2 my-lg-0'>
                      <img className='icon' src={Search} alt='' />
                      <input
                        className='form-control mr-sm-2'
                        type='search'
                        placeholder='Search by Name'
                        aria-label='Search'
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-fluid'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-12 col-lg-3'>
                    <div className='row mb-4'>
                      <div className='left-section mb-2'>Sort by</div>
                      <div className='list-sort'>
                        <div className='dropdown w-100'>
                          <button
                            className='btn btn-dark dropdown-toggle w-100'
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                          >
                            {orderBy}
                          </button>
                          <ul className='dropdown-menu'>
                            <li>
                              <a
                                className='dropdown-item'
                                onClick={() => setOrderBy('Population')}
                              >
                                Population
                              </a>
                            </li>
                            <li>
                              <a
                                className='dropdown-item'
                                onClick={() => setOrderBy('Area')}
                              >
                                Area
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='row mb-4'>
                      <div className='left-section mb-2'>Region</div>
                      <ul className='list-region'>
                        <li
                          className={activeRegion === 'all' ? 'active' : ''}
                          onClick={() => fetchData(urlBase, 'all')}
                        >
                          {' '}
                          All Regions
                        </li>
                        <li
                          className={
                            activeRegion === 'region/americas' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/americas')}
                        >
                          Americas
                        </li>
                        <li
                          className={
                            activeRegion === 'region/Antarctic' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/Antarctic')}
                        >
                          Antartic
                        </li>
                        <li
                          className={
                            activeRegion === 'region/africa' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/africa')}
                        >
                          Africa
                        </li>
                        <li
                          className={
                            activeRegion === 'region/asia' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/asia')}
                        >
                          Asia
                        </li>
                        <li
                          className={
                            activeRegion === 'region/europe' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/europe')}
                        >
                          Europe
                        </li>
                        <li
                          className={
                            activeRegion === 'region/oceania' ? 'active' : ''
                          }
                          onClick={() => fetchData(urlBase, 'region/oceania')}
                        >
                          Oceania
                        </li>
                      </ul>
                    </div>
                    <div className='row mb-4'>
                      <div className='left-section mb-2'>Status</div>
                      <div className='list-status'>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value=''
                            id='unMemberCheckbox'
                            checked={showUNMember}
                            onChange={() => setShowUNMember(!showUNMember)}
                          />
                          <label
                            className='form-check-label'
                            htmlFor='unMemberCheckbox'
                          >
                            Member of the United Nations
                          </label>
                        </div>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value=''
                            id='independentCheckbox'
                            checked={showIndependent}
                            onChange={() =>
                              setShowIndependent(!showIndependent)
                            }
                          />
                          <label
                            className='form-check-label'
                            htmlFor='independentCheckbox'
                          >
                            Independent
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-lg-9'>
                    <div className='col-12 data-country table d-flex justify-content-between'>
                      <p className='col-2 flag-container-table'>Flag</p>
                      <p className='col-2'>Name</p>
                      <p className='col-2 population'>Population</p>
                      <p className='col-2 area'>Area (km²)</p>
                      <p className='col-2'>Region</p>
                    </div>
                    <div className='col-12 list-countries'>
                      <div>
                        {countries.map((country) => (
                          <div className='row' key={country.ccn3}>
                            <div className='col-12 data-country'>
                              <div className='col-2 flag-container'>
                                <img
                                  className='flag'
                                  src={country.flags.png}
                                  alt={country.flags.alt}
                                />
                              </div>
                              <p className='name col-2'>
                                {country.name.common}
                              </p>
                              <p className='population col-2'>
                                {country.originalPopulation}
                              </p>
                              <p className='area col-2'>
                                {country.originalArea}
                              </p>
                              <p className='region col-3 col-lg-2'>
                                {country.region}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;
