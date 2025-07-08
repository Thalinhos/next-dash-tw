export default async function ProdutoRetrieve() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/products', { cache: 'no-store', credentials: 'include' });
    if (!res.ok) {
      return <div>Erro ao buscar produtos.</div>;
    }
    const data = await res.json();
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error: any) {
    return <div>Erro: {error.message}</div>;
  }
}