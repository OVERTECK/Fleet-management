using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.DataAccess.Entities;

public class UserEntity
{
    public required Guid Id { get; set; }

    public required string Login { get; set; }

    public required string Password { get; set; }

    public required int RoleId { get; set; }

    public RoleEntity Role { get; set; }
}