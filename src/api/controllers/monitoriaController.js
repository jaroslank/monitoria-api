import * as monitoriaService from '../services/monitoriaService.js';
import { validationResult } from 'express-validator';

// Controller para listar todas as monitorias ativas.
const listarTodas = async (req, res, next) => {
    try {
        const monitorias = await monitoriaService.listar();
        res.status(200).json(monitorias);
    } catch (error) {
        next(error);
    }
};

//Cria uma nova monitoria com base nos dados fornecidos no corpo da requisição.
const criarUma = async (req, res, next) => {
    // 1. Verifica se a validação da rota (definida em monitoriaRoutes.js) encontrou erros.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Se houver erros, retorna uma resposta 400 (Bad Request) com a lista de erros.
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // 2. Extrai os dados do corpo da requisição.
        const dadosMonitoria = req.body;

        // 3. Chama a camada de serviço para executar a lógica de criação.
        const novaMonitoria = await monitoriaService.criar(dadosMonitoria);
        
        // 4. Retorna a monitoria recém-criada com o status 201 (Created).
        res.status(201).json(novaMonitoria);
    } catch (error) {
        // 5. Se ocorrer qualquer erro lançado pela camada de serviço (ex: 404, 403, 409),
        // ele é capturado e passado para o middleware de tratamento de erros.
        next(error);
    }
};

const buscarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        const monitoria = await monitoriaService.buscarPorId(id);
        res.status(200).json(monitoria);
    } catch (error) {
        next(error);
    }
};

const atualizarUma = async (req, res, next) => {
    // 1. Verifica se a validação da rota (definida em monitoriaRoutes.js) encontrou erros.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se houver erros, retorna uma resposta 400 (Bad Request) com a lista de erros.
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // 2. Extrai o ID dos parâmetros da rota e os dados do corpo da requisição.
        const { id } = req.params;
        const dadosAtualizados = req.body;

        // 3. Chama a camada de serviço para executar a lógica de atualização.
        const monitoriaAtualizada = await monitoriaService.atualizar(id, dadosAtualizados);
        
        // 4. Retorna a monitoria atualizada com o status 200 (OK).
        res.status(200).json(monitoriaAtualizada);
    } catch (error) {
        // 5. Se ocorrer qualquer erro lançado pela camada de serviço (ex: 404, 403),
        // ele é capturado e passado para o middleware de tratamento de erros.
        next(error);
    }
};

// Controller para desativar (soft delete) um usuário
const deletarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        await monitoriaService.deletar(id);
        // Resposta 204 No Content é o padrão para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

const reativarUma = async (req, res, next) => {
    try {
        const { id } = req.params;
        const monitoriaReativada = await monitoriaService.reativar(id);
        res.status(200).json(monitoriaReativada);
    } catch (error) {
        next(error);
    }
};

export {
    listarTodas,
    criarUma,
    buscarUma,
    atualizarUma,
    deletarUma,
    reativarUma
};