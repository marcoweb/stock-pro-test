
import prismaClient from "../../prisma";

interface ExitRequest {
    quantidade: number | string; // Permite que quantidade seja um número ou string
    product_id: string;
}

class CreateExitService {
    async execute({ quantidade, product_id }: ExitRequest) {
        // Verifica se o ID do produto foi fornecido
        if (!product_id) {
            throw new Error('Product ID is required.');
        }

        // Verifica se o produto existe no banco de dados
        const product = await prismaClient.product.findUnique({
            where: { id: product_id },
        });

        if (!product) {
            throw new Error('Produto não encontrado.');
        }

        // Converte a quantidade para número, se necessário
        const quantidadeAsNumber = typeof quantidade === 'string' ? parseInt(quantidade) : quantidade;

        if (isNaN(quantidadeAsNumber)) {
            throw new Error('Quantidade inválida.');
        }

        // Cria a nova entrada (Exit)
        const output = await prismaClient.output.create({
            data: {
                quantidade: quantidadeAsNumber, // Garante que seja um número
                product: {
                    connect: { id: product_id }
                }
            }
        });

        return output;
    }
}

export { CreateExitService };