import React, { useEffect, useState } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const HelloWorld = () => {
  const [date, setDate] = useState();
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  useEffect(() => {
    fetch(`${backendUrl}/api/catalog/hello`)
      .then(response => response.json())
      .then(payload => {
        setDate(payload.date);
      });
  }, [backendUrl]);

  return (
    <div>
      <h1>Hello World!!</h1>
      <p>We are now: {date}.</p>
    </div>
  );
};
