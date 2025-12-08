using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class RouteEntity
{
    public required Guid Id { get; init; }

    public required double Latitude { get; init; }

    public required double Longitude { get; init; }

    // public required string Address { get; init; }

    // public required DateTime TimeStamp { get; init; }

    public required Guid TripId { get; init; }

    [JsonIgnore]
    public TripEntity? Trip { get; init; }
}