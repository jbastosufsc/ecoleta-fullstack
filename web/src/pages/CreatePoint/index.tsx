import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

import './styles.css';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECitiesResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('0');

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECitiesResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const citiesName = response.data.map((city) => city.nome);
        setCities(citiesName);
      });
  }, [selectedUf]);

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    console.log(city);
    setSelectedCity(city);
  }

  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt='Ecoleta' />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className='field'>
            <label htmlFor='name'>Nome da entidade</label>
            <input type='text' name='name' id='name' />
          </div>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='email'>E-mail</label>
              <input type='email' name='email' id='email' />
            </div>

            <div className='field'>
              <label htmlFor='whatsapp'>Whatsapp</label>
              <input type='text' name='whatsapp' id='whatsapp' />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-27.5516102, -48.6288651]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[-27.5516102, -48.6288651]} />
          </Map>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'>Estado (UF)</label>
              <select
                name='uf'
                id='uf'
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value='0'>Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className='field'>
              <label htmlFor='city'>Cidade</label>
              <select
                name='city'
                id='city'
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value='0'>Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className='items-grid'>
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image_url} alt='Teste' />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type='submit'>Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
