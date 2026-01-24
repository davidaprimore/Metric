/**
 * CEP Lookup Utility using ViaCEP API
 * Reference: https://viacep.com.br/
 */

export interface AddressData {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export const fetchAddressByCEP = async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) return null;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data: AddressData = await response.json();

        if (data.erro) {
            console.error('CEP não encontrado');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
};
