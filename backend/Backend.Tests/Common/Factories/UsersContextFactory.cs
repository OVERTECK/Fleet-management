using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests.Common;

public class UsersContextFactory : BaseContextFactory
{
    public static Guid UserAId = Guid.NewGuid();
    public static Guid UserBId = Guid.NewGuid();
    
    public static string UserALogin = "admin";

    public static List<RoleEntity> Roles = new List<RoleEntity>
    {
        new RoleEntity
        {
            Id = 1,
            Title = "Водитель",
        },

        new RoleEntity
        {
            Id = 2,
            Title = "Диспетчер"
        },

        new RoleEntity
        {
            Id = 3,
            Title = "Администратор"
        },
    };

    public static List<UserEntity> Users = new List<UserEntity>
    {
        new UserEntity
        {
            Id = UserAId,
            Login = UserALogin,
            Password = "hash1",
            RoleId = 1,
            // Role = Roles[0],
        },

        new UserEntity
        {
            Id = UserBId,
            Login = "user",
            Password = "hash1",
            RoleId = 2,
            // Role = Roles[1],
        }
    };

    protected override void SeedData(MyDbContext context)
    {
        context.Users.AddRange(Users);
    }
}