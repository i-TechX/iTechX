% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% %
% % SI231b: Matrix Computations
% % ShanghaiTech University
% % Test code for Iterative methods for linear systems
% % Written by Yue Qiu
% %
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clc
clear

n = 1e3;    % size of the system 
max_iter = 1e4; % maximum number of iterations
tol = 1e-3; % residual tolerance
b = zeros(n, 1);    % rhs
b(1) = 1;
A = gallery('tridiag', n, -1, 2, -1);   % coefficient matrix

D = diag(diag(A));    % diagonal part of A
U = triu(A, 1);    % strictly upper-triangular part
L = tril(A, -1);    % strictly lower-triangular part

% the iteration matrix is used to check the spectral radius
% M_j = D\(-L - U);   % iteration matrix of Jacobi method
% M_gs = (D+L)\(-U);   % iteration matrix of Gauss-Seidel 

x = zeros(n, 1);    % initial solution
res_norm = norm(b); % norm of the initial residual  
iter = 1;
err_j = zeros(max_iter, 1);

% %%%%%%%%%%%%%%%%%%%%%
% % Jacobi Iteration
% %%%%%%%%%%%%%%%%%%%%%

while res_norm > tol && iter < max_iter
    x = (-L - U)*x + b;
    x = D\x;
    res_norm = norm(b - A*x);
    err_j(iter) = res_norm;
    fprintf('\n ---- Jacobi iteration %5d with residual %5.4e \n', iter, res_norm);
    iter = iter + 1;
end

iter_J = iter - 1;

% %%%%%%%%%%%%%%%%%%%
% % Gauss-Seidel Iteration
% %%%%%%%%%%%%%%%%%%%

iter = 1;
x = zeros(n, 1);
res_norm = norm(b); % norm of the initial residual
err_gs = zeros(max_iter, 1);
while res_norm > tol && iter < max_iter
    x = - U*x + b;
    x = (D + L)\x;
    res_norm = norm(b - A*x);
    err_gs(iter) = res_norm; 
    fprintf('\n ---- Gauss-Seidel iteration %5d with residual %5.4e \n', iter, res_norm);
    iter = iter + 1;
end
iter_GS = iter - 1;

fprintf('Jacobi method solves with %5d iterations \n', iter_J);
fprintf('Gauss-Seidel method solves with %5d iterations \n', iter_GS);

semilogy(err_j, 'b-');
xlabel('iter.')
ylabel('$\|b-Ax_k\|_2$', 'interpreter', 'latex')
hold on
semilogy(err_gs, 'r-.');
legend('Jacobi', 'Gauss-Seidel')
hold off




