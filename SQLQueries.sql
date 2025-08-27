CREATE DATABASE Userhub;
USE Userhub;

-- Create Tables
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO Roles (RoleName) VALUES ('Admin'), ('User');

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(200) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    DateOfBirth DATE NOT NULL,
    RoleId INT NOT NULL DEFAULT 2,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);


-- View for get user with role name
CREATE VIEW vw_UsersWithRoles AS
SELECT 
    u.Id,
    u.FullName,
    u.Email,
    u.PhoneNumber,
    u.DateOfBirth,
    r.RoleName AS Role,
    u.IsActive,
    u.CreatedAt,
    u.UpdatedAt
FROM Users u
JOIN Roles r ON u.RoleId = r.RoleId;


-- Stored procedure for register an user
CREATE PROCEDURE sp_RegisterUser
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(200),
    @PhoneNumber NVARCHAR(20),
    @DateOfBirth DATE,
    @RoleId INT = 2
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        RAISERROR('Email already exists.', 16, 1);
        RETURN;
    END

    IF @DateOfBirth >= CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR('Date of Birth must be in the past.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleId = @RoleId)
    BEGIN
        RAISERROR('Invalid RoleId.', 16, 1);
        RETURN;
    END

    DECLARE @NewId INT;

    INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, DateOfBirth, RoleId)
    VALUES (@FullName, @Email, @PasswordHash, @PhoneNumber, @DateOfBirth, @RoleId);

    SET @NewId = SCOPE_IDENTITY();

    SELECT * FROM vw_UsersWithRoles WHERE Id = @NewId;
END;


-- Stored procedure for get user when login
CREATE PROCEDURE sp_LoginUser
	@Email NVARCHAR(100)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT u.Id, u.FullName, u.Email, u.PasswordHash, u.PhoneNumber, u.DateOfBirth, r.RoleName AS Role, u.IsActive, u.CreatedAt, u.UpdatedAt
	FROM Users u 
	JOIN Roles r ON u.RoleId = r.RoleId
	WHERE u.Email = @Email AND u.IsActive = 1;

END;


-- Stored procedure for get all users
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM vw_UsersWithRoles;
End;

-- Stored procedure for get user by id
CREATE PROCEDURE sp_GetUserById
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM vw_UsersWithRoles WHERE Id = @UserId;
End;


-- Stored procedure to update user
CREATE PROCEDURE sp_UpdateUser
    @UserId INT,
    @PhoneNumber NVARCHAR(20) = NULL,
    @DateOfBirth DATE = NULL,
    @RoleId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
    BEGIN
        RAISERROR('User not found.', 16, 1);
        RETURN;
    END

    IF @DateOfBirth IS NOT NULL AND @DateOfBirth >= CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR('Date of Birth must be in the past.', 16, 1);
        RETURN;
    END

    IF @RoleId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Roles WHERE RoleId = @RoleId)
    BEGIN
        RAISERROR('Invalid Role.', 16, 1);
        RETURN;
    END

    UPDATE Users
    SET PhoneNumber = ISNULL(@PhoneNumber, PhoneNumber),
        DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth),
        RoleId = ISNULL(@RoleId, RoleId),
        UpdatedAt = GETDATE()
    WHERE Id = @UserId;

    SELECT * FROM vw_UsersWithRoles WHERE Id = @UserId;
END;


-- Stored procedure to delete user ( soft delete ) 
CREATE PROCEDURE sp_DeleteUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
    BEGIN
        RAISERROR('User not found.', 16, 1);
        RETURN;
    END

    UPDATE Users
    SET IsActive = 0,
        UpdatedAt = GETDATE()
    WHERE Id = @UserId;

    SELECT * FROM vw_UsersWithRoles WHERE Id = @UserId;
END;


-- Stored procedure for get all roles
CREATE PROCEDURE sp_GetAllRoles
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM Roles;
END;