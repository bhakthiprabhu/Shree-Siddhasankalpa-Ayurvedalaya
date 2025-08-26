"use client"
import React from 'react';
import { useEffect } from 'react';
import ErrorPage from '@/components/ErrorPage/ErrorPage';

export default function Error({ error }) {
  useEffect(() => {
  }, [error]);

  let errorMessage = 'An unexpected error occurred!!';

  return <ErrorPage message={errorMessage} />;
}
