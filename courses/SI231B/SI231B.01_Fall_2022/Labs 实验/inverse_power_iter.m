% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% %
% % SI231b: Matrix Computations
% % ShanghaiTech University
% % Test code for the inverse power iteration
% % Written by Yue Qiu
% %
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clc
close all

n = 10; % size of the tested matrix
iter = 40;  % number of iterations
err = zeros(n, 1);  % a vector to store the error between computed eigenvalue and real eigenvalue

% for simplicity, we use the real symmetric matrix 

lambda = [10, 9.5, 8, 7, 6, 5, 4, 3, 1.05, 1];
Lambda = diag(lambda);
V = randn(n, n);
V = orth(V);    % orthonormalize columns of V and make them the eigenvectors of A

A = V*Lambda*V';

q = randn(n, 1);
q = q/norm(q, 2);

% to reduce the computational complexity, we use the LU factorization
[LA, UA] = lu(A);

for i = 1 : iter
    q = LA\q;
    q = UA\q;
    q = q/norm(q, 2);
    lam = q'*A*q;
    err(i) = abs(min(abs(lambda)) - lam);
end

fprintf('The 2-norm of the residual A*q - lambda*q equals %6.2e \n', norm(A*q-lam*q, 2))


% plot the error between computed eigenvalue and the real eigenvalue
semilogy(err)

