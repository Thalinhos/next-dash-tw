'use server'

export async function peganobreu(initialState: any, formData: FormData) {
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const teste1 = formData.get('teste1')?.toString().trim();
    const teste2 = formData.get('teste2')?.toString().trim();

    if (!teste1 || !teste2) {
      return { success: false, message: "Nomes precisam ser passados!" };
    }

    console.log('Valores válidos:', teste1, teste2);

    return { success: true, message: "Sucesso ao inserir dados!" };
  } catch (error) {
    return { success: false, message: "Erro ao inserir dados" };
  }
}